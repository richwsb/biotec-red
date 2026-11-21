/* ============================================================================
   ARQUIVO CONFIDENCIAL — Motor de Áudio Procedural de Estúdio (Web Audio API)
   Arquitetura em buses reais:
     Master (+ DynamicsCompressorNode Limiter)
       <- Ambience -> AmbienceDuck (chuva, gotas, relógio reativo)
       <- Music    -> MusicDuck    (jazz noir abafado)
       <- SFX                      (carimbo, destrava, contradição, medalha, erro)
       <- UI                       (papel, pasta, clique de máquina, trava)
   Inclui curva perceptual quadrática (v²), ducking dinâmico sem sobrescrever
   sliders do jogador, pool de AudioBuffers pré-gerados e micro-variação de pitch.
   ============================================================================ */
(function (global) {
    'use strict';

    const MisteryAudio = (() => {
        let ctx = null;
        let masterGain = null;
        let masterLimiter = null;

        // Bus gain nodes + dedicated ducking nodes (never overwrite user slider gain)
        let ambienceBus = null;
        let ambienceDuck = null;
        let musicBus = null;
        let musicDuck = null;
        let sfxBus = null;
        let uiBus = null;

        // Pre-generated noise buffer pool (allocated once per AudioContext)
        const noisePool = {
            rain: null,
            paper: null,
            folder: null,
            thud: null
        };

        let enabled = true;
        let ambienceMode = 'rain_jazz'; // 'rain_jazz' | 'rain' | 'jazz' | 'clock' | 'sfx_only'
        let tensionLevel = 0; // 0: normal, 1: alerta, 2: acusação, 3: acusação + baixa autoridade
        let userGestureUnlocked = false;

        // Normalized [0..1] user slider levels per bus
        const busLevels = {
            ambience: 0.62,
            music: 0.58,
            sfx: 0.85,
            ui: 0.72
        };

        // Base headroom multipliers per bus (keeps mix below -1 dBTP)
        const BUS_HEADROOM = {
            ambience: 0.55,
            music: 0.52,
            sfx: 0.92,
            ui: 0.82
        };

        // Active ambient nodes / timers
        let rainSource = null;
        let rainFilterLfo = null;
        let rainFilterLfoGain = null;
        let rainGainNode = null;
        let rainDropTimer = null;
        let jazzTimer = null;
        let jazzStep = 0;
        let clockTimer = null;
        let clockTickParity = 0;
        let duckReleaseTimer = null;
        let ambienceActive = false;

        function clamp01(val) {
            const n = Number(val);
            if (!Number.isFinite(n)) return 0;
            return Math.max(0, Math.min(1, n));
        }

        // Perceptual quadratic volume curve: true silence at 0, natural travel across 0..1
        function sliderToGain(slider01, headroom) {
            const v = clamp01(slider01);
            if (v <= 0.001) return 0;
            return v * v * (headroom || 1);
        }

        // Micro-variation helper to kill "machine-gun" repetition
        function vary(base, spread) {
            return base * (1 + (Math.random() * 2 - 1) * spread);
        }

        function initNoisePool(c) {
            if (noisePool.rain) return;
            const sr = c.sampleRate;

            // 3s truly seamless brown-ish rain noise (equal-power tail-into-head crossfade)
            const rainLen = Math.floor(sr * 3);
            const seam = Math.floor(sr * 0.25);
            const rawRain = new Float32Array(rainLen + seam);
            let lastOut = 0;
            for (let i = 0; i < rawRain.length; i++) {
                const white = Math.random() * 2 - 1;
                lastOut = (lastOut + 0.04 * white) / 1.04;
                rawRain[i] = lastOut * 2.6;
            }
            const rainBuf = c.createBuffer(1, rainLen, sr);
            const rainData = rainBuf.getChannelData(0);
            for (let i = 0; i < rainLen; i++) {
                if (i < seam) {
                    const k = i / seam;
                    const fadeIn = Math.sin(k * Math.PI * 0.5);
                    const fadeOut = Math.cos(k * Math.PI * 0.5);
                    rainData[i] = rawRain[i] * fadeIn + rawRain[rainLen + i] * fadeOut;
                } else {
                    rainData[i] = rawRain[i];
                }
            }
            noisePool.rain = rainBuf;

            // Short crisp paper rustle (0.095s)
            const paperLen = Math.floor(sr * 0.095);
            const paperBuf = c.createBuffer(1, paperLen, sr);
            const paperData = paperBuf.getChannelData(0);
            for (let i = 0; i < paperLen; i++) {
                paperData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.03));
            }
            noisePool.paper = paperBuf;

            // Folder slide rustle (0.165s)
            const folderLen = Math.floor(sr * 0.165);
            const folderBuf = c.createBuffer(1, folderLen, sr);
            const folderData = folderBuf.getChannelData(0);
            for (let i = 0; i < folderLen; i++) {
                folderData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.055));
            }
            noisePool.folder = folderBuf;

            // Dry paper/wood thud burst for stamp (0.075s)
            const thudLen = Math.floor(sr * 0.075);
            const thudBuf = c.createBuffer(1, thudLen, sr);
            const thudData = thudBuf.getChannelData(0);
            for (let i = 0; i < thudLen; i++) {
                thudData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.018));
            }
            noisePool.thud = thudBuf;
        }

        function applyAllBusGains(immediate) {
            if (!ctx) return;
            const now = ctx.currentTime;
            const pairs = [
                [ambienceBus, sliderToGain(busLevels.ambience, BUS_HEADROOM.ambience)],
                [musicBus, sliderToGain(busLevels.music, BUS_HEADROOM.music)],
                [sfxBus, sliderToGain(busLevels.sfx, BUS_HEADROOM.sfx)],
                [uiBus, sliderToGain(busLevels.ui, BUS_HEADROOM.ui)]
            ];
            pairs.forEach(([node, target]) => {
                if (!node) return;
                if (immediate) {
                    node.gain.setValueAtTime(target, now);
                } else {
                    node.gain.setTargetAtTime(target, now, 0.035);
                }
            });
        }

        function ensureContext() {
            if (!ctx) {
                const AudioCtx = global.AudioContext || global.webkitAudioContext;
                if (!AudioCtx) return null;
                ctx = new AudioCtx();

                // Master -> Limiter -> Destination
                masterGain = ctx.createGain();
                masterGain.gain.value = enabled ? 1 : 0;

                masterLimiter = ctx.createDynamicsCompressor();
                masterLimiter.threshold.value = -6;
                masterLimiter.knee.value = 6;
                masterLimiter.ratio.value = 12;
                masterLimiter.attack.value = 0.003;
                masterLimiter.release.value = 0.15;

                masterGain.connect(masterLimiter);
                masterLimiter.connect(ctx.destination);

                // Ambience -> AmbienceDuck -> Master
                ambienceBus = ctx.createGain();
                ambienceDuck = ctx.createGain();
                ambienceDuck.gain.value = 1;
                ambienceBus.connect(ambienceDuck).connect(masterGain);

                // Music -> MusicDuck -> Master
                musicBus = ctx.createGain();
                musicDuck = ctx.createGain();
                musicDuck.gain.value = 1;
                musicBus.connect(musicDuck).connect(masterGain);

                // SFX -> Master
                sfxBus = ctx.createGain();
                sfxBus.connect(masterGain);

                // UI -> Master
                uiBus = ctx.createGain();
                uiBus.connect(masterGain);

                applyAllBusGains(true);
                initNoisePool(ctx);
            }
            if (ctx.state === 'suspended' && userGestureUnlocked) {
                ctx.resume().catch(() => { });
            }
            return ctx;
        }

        function duckBackground(targetRatio, holdMs, releaseSec) {
            if (!ctx || !ambienceDuck || !musicDuck) return;
            const now = ctx.currentTime;
            const dip = Math.max(0.15, Math.min(1, targetRatio || 0.3));
            const hold = Math.max(120, holdMs || 450);
            const rel = Math.max(0.15, releaseSec || 0.38);

            [ambienceDuck, musicDuck].forEach(node => {
                try {
                    node.gain.cancelScheduledValues(now);
                    node.gain.setTargetAtTime(dip, now, 0.03);
                } catch (_) { }
            });

            if (duckReleaseTimer) clearTimeout(duckReleaseTimer);
            duckReleaseTimer = setTimeout(() => {
                if (!ctx || !ambienceDuck || !musicDuck) return;
                const t = ctx.currentTime;
                [ambienceDuck, musicDuck].forEach(node => {
                    try {
                        node.gain.cancelScheduledValues(t);
                        node.gain.setTargetAtTime(1.0, t, rel * 0.45);
                    } catch (_) { }
                });
            }, hold);
        }

        function unlock() {
            userGestureUnlocked = true;
            const c = ensureContext();
            if (c && enabled && !ambienceActive) {
                startAmbience();
            }
        }

        function stopAmbience() {
            ambienceActive = false;
            if (duckReleaseTimer) {
                clearTimeout(duckReleaseTimer);
                duckReleaseTimer = null;
            }
            if (rainSource) {
                try { rainSource.stop(); } catch (_) { }
                try { rainSource.disconnect(); } catch (_) { }
                rainSource = null;
            }
            if (rainFilterLfo) {
                try { rainFilterLfo.stop(); } catch (_) { }
                try { rainFilterLfo.disconnect(); } catch (_) { }
                rainFilterLfo = null;
            }
            if (rainFilterLfoGain) {
                try { rainFilterLfoGain.disconnect(); } catch (_) { }
                rainFilterLfoGain = null;
            }
            if (rainGainNode) {
                try { rainGainNode.disconnect(); } catch (_) { }
                rainGainNode = null;
            }
            if (rainDropTimer) {
                clearInterval(rainDropTimer);
                rainDropTimer = null;
            }
            if (jazzTimer) {
                clearInterval(jazzTimer);
                jazzTimer = null;
            }
            if (clockTimer) {
                clearTimeout(clockTimer);
                clockTimer = null;
            }
        }

        function startRainLoop() {
            const c = ensureContext();
            if (!c || !ambienceBus || !noisePool.rain) return;

            const src = c.createBufferSource();
            src.buffer = noisePool.rain;
            src.loop = true;

            const bp = c.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = 880;
            bp.Q.value = 0.55;

            const lp = c.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 2050;

            const lfo = c.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.11;
            const lfoGain = c.createGain();
            lfoGain.gain.value = 175;
            lfo.connect(lfoGain).connect(bp.frequency);

            const rGain = c.createGain();
            rGain.gain.value = 0.44;

            src.connect(bp).connect(lp).connect(rGain).connect(ambienceBus);
            src.start();
            lfo.start();

            rainSource = src;
            rainFilterLfo = lfo;
            rainFilterLfoGain = lfoGain;
            rainGainNode = rGain;

            rainDropTimer = setInterval(() => {
                if (!enabled || !ctx || ctx.state !== 'running' || !ambienceBus) return;
                if (Math.random() > 0.52) return;
                try {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    const now = ctx.currentTime;
                    const freq = 920 + Math.random() * 980;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    osc.frequency.exponentialRampToValueAtTime(freq * 0.54, now + 0.072);
                    g.gain.setValueAtTime(0.0005, now);
                    g.gain.linearRampToValueAtTime(vary(0.026, 0.25), now + 0.004);
                    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.082);
                    osc.connect(g).connect(ambienceBus);
                    osc.start(now);
                    osc.stop(now + 0.09);
                } catch (_) { }
            }, 980);
        }

        function startJazzLoop() {
            const c = ensureContext();
            if (!c || !musicBus) return;
            // Slow noir progression: Cm9 -> Fm9 -> G7b9 -> Cm9
            const chords = [
                { bass: 65.41, notes: [196.0, 233.08, 293.66, 311.13] },
                { bass: 87.31, notes: [207.65, 261.63, 311.13, 392.0] },
                { bass: 98.00, notes: [207.65, 246.94, 293.66, 349.23] },
                { bass: 65.41, notes: [196.0, 233.08, 293.66, 392.0] }
            ];

            const playChordStep = () => {
                if (!enabled || !ctx || ctx.state !== 'running' || !musicBus) return;
                try {
                    const ch = chords[jazzStep % chords.length];
                    jazzStep++;
                    const now = ctx.currentTime;

                    // Muffled upright bass
                    const bassOsc = ctx.createOscillator();
                    const bassGain = ctx.createGain();
                    const bassFilter = ctx.createBiquadFilter();
                    bassOsc.type = 'triangle';
                    bassOsc.frequency.setValueAtTime(ch.bass, now);
                    bassFilter.type = 'lowpass';
                    bassFilter.frequency.value = 250;
                    bassGain.gain.setValueAtTime(0.001, now);
                    bassGain.gain.linearRampToValueAtTime(0.24, now + 0.055);
                    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.25);
                    bassOsc.connect(bassFilter).connect(bassGain).connect(musicBus);
                    bassOsc.onended = () => {
                        try { bassOsc.disconnect(); bassFilter.disconnect(); bassGain.disconnect(); } catch (_) { }
                    };
                    bassOsc.start(now);
                    bassOsc.stop(now + 2.35);

                    // Muffled Rhodes-like chord
                    const padFilter = ctx.createBiquadFilter();
                    padFilter.type = 'lowpass';
                    padFilter.frequency.value = 600;
                    padFilter.connect(musicBus);

                    let remaining = ch.notes.length;
                    ch.notes.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const g = ctx.createGain();
                        const startAt = now + idx * 0.062;
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, startAt);
                        g.gain.setValueAtTime(0.001, startAt);
                        g.gain.linearRampToValueAtTime(0.046, startAt + 0.16);
                        g.gain.exponentialRampToValueAtTime(0.001, startAt + 2.7);
                        osc.connect(g).connect(padFilter);
                        osc.onended = () => {
                            try { osc.disconnect(); g.disconnect(); } catch (_) { }
                            remaining -= 1;
                            if (remaining <= 0) {
                                try { padFilter.disconnect(); } catch (_) { }
                            }
                        };
                        osc.start(startAt);
                        osc.stop(startAt + 2.8);
                    });
                } catch (_) { }
            };

            playChordStep();
            jazzTimer = setInterval(playChordStep, 2900);
        }

        function scheduleClockTick() {
            if (!enabled) return;
            const shouldTick = ambienceMode === 'clock' || (ambienceMode !== 'sfx_only' && tensionLevel >= 1);
            if (!shouldTick) return;

            const intervals = [1000, 720, 540, 410];
            const intervalMs = intervals[Math.max(0, Math.min(3, tensionLevel))];

            clockTimer = setTimeout(() => {
                if (enabled && ctx && ctx.state === 'running' && ambienceBus) {
                    try {
                        const now = ctx.currentTime;
                        const osc = ctx.createOscillator();
                        const g = ctx.createGain();
                        const isTic = clockTickParity % 2 === 0;
                        clockTickParity++;
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(vary(isTic ? 1750 : 1320, 0.025), now);
                        osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);
                        const amp = tensionLevel >= 2 ? 0.14 : 0.08;
                        g.gain.setValueAtTime(0.0005, now);
                        g.gain.linearRampToValueAtTime(amp, now + 0.003);
                        g.gain.exponentialRampToValueAtTime(0.0005, now + 0.032);
                        osc.connect(g).connect(ambienceBus);
                        osc.start(now);
                        osc.stop(now + 0.036);
                    } catch (_) { }
                }
                scheduleClockTick();
            }, intervalMs);
        }

        function startAmbience() {
            stopAmbience();
            if (!enabled || !userGestureUnlocked) return;
            const c = ensureContext();
            if (!c) return;
            ambienceActive = true;

            if (ambienceMode === 'rain_jazz' || ambienceMode === 'rain') {
                startRainLoop();
            }
            if (ambienceMode === 'rain_jazz' || ambienceMode === 'jazz') {
                startJazzLoop();
            }
            if (ambienceMode === 'clock' || (ambienceMode !== 'sfx_only' && tensionLevel >= 1)) {
                scheduleClockTick();
            }
        }

        function setEnabled(val) {
            enabled = Boolean(val);
            if (masterGain && ctx) {
                masterGain.gain.setTargetAtTime(enabled ? 1 : 0, ctx.currentTime, 0.035);
            }
            if (!enabled) {
                stopAmbience();
            } else if (userGestureUnlocked && !ambienceActive) {
                startAmbience();
            }
        }

        function isEnabled() {
            return enabled;
        }

        function setAmbienceMode(mode) {
            const allowed = ['rain_jazz', 'rain', 'jazz', 'clock', 'sfx_only'];
            if (!allowed.includes(mode)) return;
            if (mode === ambienceMode && ambienceActive) return;
            ambienceMode = mode;
            if (enabled && userGestureUnlocked) {
                startAmbience();
            }
        }

        function getAmbienceMode() {
            return ambienceMode;
        }

        function setBusVolume(busName, slider01) {
            if (!Object.prototype.hasOwnProperty.call(busLevels, busName)) return;
            busLevels[busName] = clamp01(slider01);
            applyAllBusGains(false);
        }

        function getBusVolumes() {
            return { ...busLevels };
        }

        function applyBusVolumes(map) {
            if (!map || typeof map !== 'object') return;
            ['ambience', 'music', 'sfx', 'ui'].forEach(key => {
                if (typeof map[key] === 'number' && Number.isFinite(map[key])) {
                    busLevels[key] = clamp01(map[key]);
                }
            });
            applyAllBusGains(false);
        }

        // Legacy single-volume compatibility API
        function setVolume(val) {
            const v = clamp01(val);
            busLevels.ambience = v;
            busLevels.music = v;
            applyAllBusGains(false);
        }

        function getVolume() {
            return busLevels.ambience;
        }

        function setTension(level) {
            const next = Math.max(0, Math.min(3, Number(level) || 0));
            const prevTicking = ambienceMode === 'clock' || (ambienceMode !== 'sfx_only' && tensionLevel >= 1);
            tensionLevel = next;
            const nowTicking = ambienceMode === 'clock' || (ambienceMode !== 'sfx_only' && tensionLevel >= 1);
            if (enabled && userGestureUnlocked) {
                if (prevTicking !== nowTicking) {
                    if (clockTimer) {
                        clearTimeout(clockTimer);
                        clockTimer = null;
                    }
                    if (nowTicking) scheduleClockTick();
                }
            }
        }

        /* ----- TACTILE UI BUS SFX (pooled noise + micro pitch/gain variation) ----- */
        function playPaper() {
            unlock();
            if (!enabled || !ctx || !uiBus || !noisePool.paper) return;
            try {
                const src = ctx.createBufferSource();
                src.buffer = noisePool.paper;
                src.playbackRate.value = vary(1.0, 0.06);

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = vary(1800, 0.07);
                filter.Q.value = 0.9;

                const gain = ctx.createGain();
                gain.gain.value = vary(0.11, 0.08);

                src.connect(filter).connect(gain).connect(uiBus);
                src.start();
            } catch (_) { }
        }

        function playFolderOpen() {
            unlock();
            if (!enabled || !ctx || !uiBus || !noisePool.folder) return;
            try {
                const now = ctx.currentTime;
                const src = ctx.createBufferSource();
                src.buffer = noisePool.folder;
                src.playbackRate.value = vary(1.0, 0.05);

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(vary(940, 0.05), now);
                filter.frequency.exponentialRampToValueAtTime(vary(2180, 0.05), now + 0.12);

                const gain = ctx.createGain();
                gain.gain.value = vary(0.14, 0.08);

                src.connect(filter).connect(gain).connect(uiBus);
                src.start(now);
            } catch (_) { }
        }

        function playTypeClick() {
            unlock();
            if (!enabled || !ctx || !uiBus) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(vary(670, 0.07), now);
                osc.frequency.exponentialRampToValueAtTime(vary(145, 0.06), now + 0.028);
                gain.gain.setValueAtTime(0.0005, now);
                gain.gain.linearRampToValueAtTime(vary(0.07, 0.1), now + 0.003);
                gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.032);
                osc.connect(gain).connect(uiBus);
                osc.start(now);
                osc.stop(now + 0.038);
            } catch (_) { }
        }

        function playLockClick() {
            unlock();
            if (!enabled || !ctx || !uiBus) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(vary(425, 0.055), now);
                osc.frequency.exponentialRampToValueAtTime(vary(180, 0.05), now + 0.025);
                g.gain.setValueAtTime(0.0005, now);
                g.gain.linearRampToValueAtTime(vary(0.055, 0.09), now + 0.003);
                g.gain.exponentialRampToValueAtTime(0.0005, now + 0.03);
                osc.connect(g).connect(uiBus);
                osc.start(now);
                osc.stop(now + 0.035);
            } catch (_) { }
        }

        /* ----- TACTILE SFX BUS (impacts, breakthroughs, stamps + dynamic ducking) ----- */
        function playPinSnap() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(vary(920, 0.06), now);
                osc.frequency.exponentialRampToValueAtTime(vary(335, 0.05), now + 0.055);
                g.gain.setValueAtTime(0.0005, now);
                g.gain.linearRampToValueAtTime(vary(0.12, 0.08), now + 0.004);
                g.gain.exponentialRampToValueAtTime(0.0005, now + 0.06);
                osc.connect(g).connect(sfxBus);
                osc.start(now);
                osc.stop(now + 0.065);
            } catch (_) { }
        }

        function playLockUnlock() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            duckBackground(0.42, 420, 0.35);
            try {
                [440, 587.33, 880].forEach((freq, idx) => {
                    const now = ctx.currentTime + idx * 0.065;
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);
                    g.gain.setValueAtTime(0.0005, now);
                    g.gain.linearRampToValueAtTime(0.1, now + 0.005);
                    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.23);
                    osc.connect(g).connect(sfxBus);
                    osc.start(now);
                    osc.stop(now + 0.25);
                });
            } catch (_) { }
        }

        function playBreakthrough() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            duckBackground(0.28, 650, 0.42);
            try {
                const notes = [329.63, 440, 554.37, 659.25];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    const t = ctx.currentTime + idx * 0.082;
                    osc.frequency.setValueAtTime(freq, t);
                    gain.gain.setValueAtTime(0.0005, t);
                    gain.gain.linearRampToValueAtTime(0.105, t + 0.006);
                    gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.35);
                    osc.connect(gain).connect(sfxBus);
                    osc.start(t);
                    osc.stop(t + 0.37);
                });
            } catch (_) { }
        }

        function playError() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            try {
                const now = ctx.currentTime;
                [160, 126].forEach((freq, idx) => {
                    const t = now + idx * 0.09;
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, t);
                    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t + 0.14);
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = 480;
                    g.gain.setValueAtTime(0.0005, t);
                    g.gain.linearRampToValueAtTime(0.12, t + 0.005);
                    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.15);
                    osc.connect(filter).connect(g).connect(sfxBus);
                    osc.start(t);
                    osc.stop(t + 0.16);
                });
            } catch (_) { }
        }

        function playStamp() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            duckBackground(0.24, 520, 0.4);
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(vary(142, 0.04), now);
                osc.frequency.exponentialRampToValueAtTime(38, now + 0.2);
                gain.gain.setValueAtTime(0.0005, now);
                gain.gain.linearRampToValueAtTime(0.23, now + 0.004);
                gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.24);
                osc.connect(gain).connect(sfxBus);
                osc.start(now);
                osc.stop(now + 0.25);

                if (noisePool.thud) {
                    const src = ctx.createBufferSource();
                    src.buffer = noisePool.thud;
                    src.playbackRate.value = vary(1.0, 0.05);
                    const f = ctx.createBiquadFilter();
                    f.type = 'lowpass';
                    f.frequency.value = 720;
                    const g2 = ctx.createGain();
                    g2.gain.value = 0.2;
                    src.connect(f).connect(g2).connect(sfxBus);
                    src.start(now);
                }
            } catch (_) { }
        }

        function playMedal() {
            unlock();
            if (!enabled || !ctx || !sfxBus) return;
            duckBackground(0.3, 620, 0.42);
            try {
                [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
                    const t = ctx.currentTime + idx * 0.075;
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, t);
                    g.gain.setValueAtTime(0.0005, t);
                    g.gain.linearRampToValueAtTime(0.095, t + 0.006);
                    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.32);
                    osc.connect(g).connect(sfxBus);
                    osc.start(t);
                    osc.stop(t + 0.34);
                });
            } catch (_) { }
        }

        return {
            unlock,
            setEnabled,
            isEnabled,
            setAmbienceMode,
            getAmbienceMode,
            setBusVolume,
            getBusVolumes,
            applyBusVolumes,
            setVolume,
            getVolume,
            setTension,
            duckBackground,
            playPaper,
            playFolderOpen,
            playTypeClick,
            playPinSnap,
            playLockClick,
            playLockUnlock,
            playBreakthrough,
            playError,
            playStamp,
            playMedal
        };
    })();

    global.MisteryAudio = MisteryAudio;
    global.SoundFX = MisteryAudio;
})(window);
