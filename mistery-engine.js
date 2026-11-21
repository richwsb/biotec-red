/* ============================================================================
   ARQUIVO CONFIDENCIAL — Motor Principal do Jogo Investigativo
   Inclui: Central de Carreira com Divulgação Progressiva, Campanha + Casos
   Paralelos, Sistema de Feedback em Tiers (Trauma Shake + FX Canvas HiDPI),
   Typewriter Sem Pulo de Linha, Registro do Inquérito (Backlog), Mini-Enigmas
   com Teclado e Discos Dinâmicos, Mural v2 (Rubber-Band, Undo/Redo, Zoom/Fit,
   WCAG 2.5.7), Pilha de Overlays com Focus Trap, Modais Diegéticos e
   Persistência Defensiva com Backup Automático.
   ============================================================================ */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'arquivo_confidencial_save_v2';
    const BACKUP_STORAGE_KEY = 'arquivo_confidencial_save_v2_bak';
    const LEGACY_STORAGE_KEY = 'arquivo_confidencial_save_v1';
    const CURRENT_SAVE_VERSION = 2;

    const Art = global.MisteryArt;
    const AudioFX = global.MisteryAudio;

    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function icon(name, size) {
        return Art && typeof Art.getUIIconSVG === 'function' ? Art.getUIIconSVG(name, size || 15) : '';
    }

    function prefersReducedMotion() {
        return Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function isEditableTarget(el) {
        if (!el) return false;
        const tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || Boolean(el.isContentEditable);
    }

    /* =========================================================================
       1. PERSISTÊNCIA DEFENSIVA, BACKUP AUTOMÁTICO E MIGRAÇÃO v1 -> v2
       ========================================================================= */
    const bootNotices = [];
    let lastStorageErrorAt = 0;

    function createEmptySave() {
        return {
            version: CURRENT_SAVE_VERSION,
            profile: {
                name: 'Detetive Silva',
                freeMode: false,
                puzzlesSolvedCount: 0,
                comparatorUsed: false,
                wrongEndingsSeen: [],
                ambienceMode: 'rain_jazz',
                soundEnabled: true,
                volume: 0.58,
                audioBuses: {
                    ambience: 0.62,
                    music: 0.58,
                    sfx: 0.85,
                    ui: 0.72
                },
                textSpeed: 'normal', // 'normal' | 'fast' | 'instant'
                shakeIntensity: 0.8,
                reduceFlashes: false
            },
            achievements: {},
            customCases: [],
            cases: {}
        };
    }

    function validateSaveObject(raw) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            return { ok: false, error: 'Estrutura raiz inválida (esperado objeto JSON).' };
        }
        if (raw.version !== undefined) {
            const v = Number(raw.version);
            if (!Number.isInteger(v) || v < 1) {
                return { ok: false, error: 'Número de versão do save inválido.' };
            }
            if (v > CURRENT_SAVE_VERSION) {
                return { ok: false, error: `Este save pertence a uma versão mais recente (v${v}) não suportada por esta edição.` };
            }
        }
        if (!raw.cases || typeof raw.cases !== 'object' || Array.isArray(raw.cases)) {
            return { ok: false, error: 'Campo obrigatório "cases" ausente ou corrompido.' };
        }
        if (raw.customCases !== undefined) {
            if (!Array.isArray(raw.customCases)) {
                return { ok: false, error: 'Campo "customCases" corrompido.' };
            }
            if (typeof global.validateCustomCase === 'function') {
                for (let i = 0; i < raw.customCases.length; i++) {
                    const checkCase = global.validateCustomCase(raw.customCases[i]);
                    if (!checkCase.ok) {
                        return { ok: false, error: `Caso customizado #${i + 1} inválido no save: ${checkCase.error}` };
                    }
                }
            }
        }
        return { ok: true };
    }

    function normalizeSaveData(parsed) {
        if (parsed && (Number(parsed.version) === 1 || (parsed.version === undefined && !parsed.profile))) {
            return migrateV1ToV2(parsed);
        }
        const base = createEmptySave();
        const prof = { ...base.profile, ...(parsed.profile || {}) };
        const legacyVol = typeof prof.volume === 'number' && Number.isFinite(prof.volume) ? prof.volume : 0.58;
        prof.audioBuses = {
            ambience: parsed.profile?.audioBuses?.ambience ?? legacyVol,
            music: parsed.profile?.audioBuses?.music ?? legacyVol,
            sfx: parsed.profile?.audioBuses?.sfx ?? base.profile.audioBuses.sfx,
            ui: parsed.profile?.audioBuses?.ui ?? base.profile.audioBuses.ui
        };
        if (!['normal', 'fast', 'instant'].includes(prof.textSpeed)) prof.textSpeed = 'normal';
        prof.soundEnabled = parsed.profile?.soundEnabled === undefined ? true : Boolean(parsed.profile.soundEnabled);
        if (typeof prof.shakeIntensity !== 'number' || !Number.isFinite(prof.shakeIntensity)) prof.shakeIntensity = 0.8;
        prof.shakeIntensity = Math.max(0, Math.min(1, prof.shakeIntensity));
        prof.reduceFlashes = Boolean(prof.reduceFlashes);
        if (!Array.isArray(prof.wrongEndingsSeen)) prof.wrongEndingsSeen = [];

        const validatedCustomCases = Array.isArray(parsed.customCases)
            ? parsed.customCases
                .map(c => (typeof global.validateCustomCase === 'function' ? global.validateCustomCase(c) : { ok: true, caseObj: c }))
                .filter(res => res && res.ok)
                .map(res => res.caseObj)
            : [];

        return {
            ...base,
            ...parsed,
            version: CURRENT_SAVE_VERSION,
            profile: prof,
            achievements: parsed.achievements && typeof parsed.achievements === 'object' ? parsed.achievements : {},
            customCases: validatedCustomCases,
            cases: parsed.cases && typeof parsed.cases === 'object' ? parsed.cases : {}
        };
    }

    function migrateV1ToV2(v1) {
        const migrated = createEmptySave();
        if (v1 && v1.cases && typeof v1.cases === 'object') {
            Object.keys(v1.cases).forEach(cid => {
                const old = v1.cases[cid] || {};
                migrated.cases[cid] = {
                    notes: old.notes || '',
                    notebookOpened: Boolean(old.notes),
                    collectedEvidences: [],
                    inspectedHotspots: [],
                    solvedPuzzles: [],
                    unlockedEvidences: Array.isArray(old.unlockedEvidences) ? old.unlockedEvidences : [],
                    askedQuestions: old.askedQuestions || {},
                    crackedSuspects: Array.isArray(old.crackedSuspects) ? old.crackedSuspects : [],
                    wrongConfronts: [],
                    confrontedSuspects: [],
                    interrogationLog: [],
                    authority: 100,
                    reopenedCount: 0,
                    corkboard: { nodes: {}, links: [], confirmedKeys: [] },
                    hintsUsed: old.hintsUsed || 0,
                    solved: Boolean(old.solved),
                    bestScore: old.bestScore ?? null,
                    bestRank: old.bestRank ?? null,
                    lastAttempt: old.lastAttempt || null
                };
            });
        }
        return migrated;
    }

    function tryParseStoredKey(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return { found: false };
            const parsed = JSON.parse(raw);
            const check = validateSaveObject(parsed);
            if (!check.ok) return { found: true, ok: false, error: check.error };
            return { found: true, ok: true, data: normalizeSaveData(parsed) };
        } catch (err) {
            return { found: true, ok: false, error: err && err.message ? err.message : 'JSON corrompido' };
        }
    }

    function loadPersistedData() {
        const primary = tryParseStoredKey(STORAGE_KEY);
        if (primary.found && primary.ok) return primary.data;

        if (primary.found && !primary.ok) {
            const backup = tryParseStoredKey(BACKUP_STORAGE_KEY);
            if (backup.found && backup.ok) {
                bootNotices.push('Save principal corrompido — progresso restaurado automaticamente do backup.');
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.data)); } catch (_) { }
                return backup.data;
            }
            bootNotices.push('Não foi possível ler o progresso anterior (arquivo corrompido). Novo perfil iniciado.');
        }

        // Try backup even if primary was missing
        const backupOnly = tryParseStoredKey(BACKUP_STORAGE_KEY);
        if (backupOnly.found && backupOnly.ok) {
            bootNotices.push('Progresso recuperado do backup automático.');
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(backupOnly.data)); } catch (_) { }
            return backupOnly.data;
        }

        // Legacy v1 migration
        try {
            const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (rawV1) {
                const v1 = JSON.parse(rawV1);
                const migrated = migrateV1ToV2(v1);
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
                } catch (_) { }
                return migrated;
            }
        } catch (_) { }

        return createEmptySave();
    }

    let persisted = loadPersistedData();

    function savePersistedData() {
        try {
            const prev = localStorage.getItem(STORAGE_KEY);
            if (prev) {
                try {
                    JSON.parse(prev);
                    localStorage.setItem(BACKUP_STORAGE_KEY, prev);
                } catch (_) { }
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
            return true;
        } catch (err) {
            const now = Date.now();
            if (now - lastStorageErrorAt > 6000) {
                lastStorageErrorAt = now;
                showToast('Aviso: não foi possível gravar no navegador (armazenamento cheio ou modo privado). Exporte um backup em JSON na Central.', { urgent: true, duration: 5200 });
            }
            return false;
        }
    }

    function getOfficialCases() {
        return Array.isArray(global.MISTERY_CASES) ? global.MISTERY_CASES : [];
    }

    function getCampaignCases() {
        return getOfficialCases().filter(c => !c.isParallel);
    }

    function getParallelCases() {
        return getOfficialCases().filter(c => Boolean(c.isParallel));
    }

    function getAllCases() {
        const official = getOfficialCases();
        const custom = Array.isArray(persisted.customCases) ? persisted.customCases : [];
        return official.concat(custom);
    }

    function getCaseById(caseId) {
        return getAllCases().find(c => c.id === caseId) || getAllCases()[0];
    }

    function ensureCaseProgress(caseId) {
        if (!persisted.cases[caseId]) {
            persisted.cases[caseId] = {
                notes: '',
                notebookOpened: false,
                collectedEvidences: [],
                inspectedHotspots: [],
                solvedPuzzles: [],
                unlockedEvidences: [],
                askedQuestions: {},
                crackedSuspects: [],
                wrongConfronts: [],
                confrontedSuspects: [],
                interrogationLog: [],
                authority: 100,
                reopenedCount: 0,
                corkboard: { nodes: {}, links: [], confirmedKeys: [] },
                hintsUsed: 0,
                solved: false,
                bestScore: null,
                bestRank: null,
                lastAttempt: null
            };
        }
        const p = persisted.cases[caseId];
        if (!Array.isArray(p.collectedEvidences)) p.collectedEvidences = [];
        if (!Array.isArray(p.inspectedHotspots)) p.inspectedHotspots = [];
        if (!Array.isArray(p.solvedPuzzles)) p.solvedPuzzles = [];
        if (!Array.isArray(p.unlockedEvidences)) p.unlockedEvidences = [];
        if (!p.askedQuestions || typeof p.askedQuestions !== 'object') p.askedQuestions = {};
        if (!Array.isArray(p.crackedSuspects)) p.crackedSuspects = [];
        if (!Array.isArray(p.wrongConfronts)) p.wrongConfronts = [];
        if (!Array.isArray(p.confrontedSuspects)) p.confrontedSuspects = [];
        if (!Array.isArray(p.interrogationLog)) p.interrogationLog = [];
        if (typeof p.notes !== 'string') p.notes = '';
        p.notebookOpened = Boolean(p.notebookOpened);
        if (typeof p.hintsUsed !== 'number' || !Number.isFinite(p.hintsUsed) || p.hintsUsed < 0) p.hintsUsed = 0;
        if (typeof p.reopenedCount !== 'number' || !Number.isFinite(p.reopenedCount) || p.reopenedCount < 0) p.reopenedCount = 0;
        p.solved = Boolean(p.solved);
        if (p.bestScore !== null && (typeof p.bestScore !== 'number' || !Number.isFinite(p.bestScore))) p.bestScore = null;
        if (typeof p.authority !== 'number' || !Number.isFinite(p.authority)) p.authority = 100;
        if (!p.corkboard || typeof p.corkboard !== 'object') p.corkboard = { nodes: {}, links: [], confirmedKeys: [] };
        if (!p.corkboard.nodes || typeof p.corkboard.nodes !== 'object') p.corkboard.nodes = {};
        if (!Array.isArray(p.corkboard.links)) p.corkboard.links = [];
        if (!Array.isArray(p.corkboard.confirmedKeys)) p.corkboard.confirmedKeys = [];
        return p;
    }

    function isCaseUnlocked(caseObj) {
        if (!caseObj || !caseObj.unlockRequires || persisted.profile.freeMode) return true;
        const reqProg = ensureCaseProgress(caseObj.unlockRequires);
        return Boolean(reqProg.solved);
    }

    function isFinalCampaignRevealed() {
        return Boolean(ensureCaseProgress('caso-06').solved);
    }

    function getVisibleEvidences(caseObj) {
        const prog = ensureCaseProgress(caseObj.id);
        return caseObj.evidences.filter(ev => {
            if (ev.initial) return true;
            if (prog.collectedEvidences.includes(ev.id)) return true;
            if (prog.unlockedEvidences.includes(ev.id)) return true;
            return false;
        });
    }

    function getEvidenceLockReason(caseObj, ev) {
        if (ev.secret) return 'Pista oculta — confronte o suspeito certo na Sala de Interrogatório.';
        if (ev.foundAtHotspot) {
            const spot = caseObj.hotspots.find(h => h.id === ev.foundAtHotspot);
            if (spot && spot.puzzle && spot.puzzle.unlocksEvidences && spot.puzzle.unlocksEvidences.includes(ev.id)) {
                return `Enigma pendente na Cena do Crime: ${spot.label} (${spot.puzzle.title}).`;
            }
            if (spot) return `Inspecione "${spot.label}" na Planta Baixa para coletar.`;
        }
        return 'Explore a Cena do Crime para desbloquear esta prova.';
    }

    /* =========================================================================
       2. ESTADO DA SESSÃO DE UI
       ========================================================================= */
    const state = {
        view: 'home', // 'home' | 'case'
        homeTab: 'campaign', // 'campaign' | 'parallel' | 'medals' | 'data'
        currentCaseId: (global.MISTERY_CASES && global.MISTERY_CASES[0].id) || 'caso-00',
        activeTab: 'scene',
        selectedSuspectId: null,
        selectedHotspotId: null,
        interrogationFeedback: null,
        backlogFilter: 'all', // 'all' | 'suspect' | 'evidence'
        backlogOpen: false,
        suspectMoods: {},
        recoilSuspectId: null,
        typewriterRafId: null,
        typewriterSkipFn: null,
        typewriterTriggerEl: null,
        activePuzzle: null,
        puzzleKeyHandler: null,
        comparator: { left: '', right: '', highlightTimes: false },
        corkboard: {
            connectMode: false,
            relation: 'contradiz',
            pendingFrom: null,
            selectedCardId: null,
            a11yOpen: false,
            zoom: 1,
            autoFitAppliedForCase: null,
            undoByCase: {},
            redoByCase: {}
        },
        showOfficialRevealAfterFail: false
    };

    /* =========================================================================
       3. GAME FEEL: TIERS, TRAUMA SHAKE, HIT-STOP VIGNETTE & FX CANVAS HiDPI
       ========================================================================= */
    let toastTimer = null;
    let toastUrgentUntil = 0;
    function showToast(msg, opts) {
        const el = document.getElementById('toast');
        if (!el) return;
        const o = opts || {};
        const now = Date.now();
        if (!o.urgent && now < toastUrgentUntil) return;
        if (o.urgent) {
            toastUrgentUntil = now + (o.duration || 4800);
        }
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), o.duration || 3800);
    }

    // Trauma-based real-time camera shake (summed inharmonic sines, quadratic falloff)
    const shakeState = {
        trauma: 0,
        t: 0,
        lastTs: 0,
        rafId: null
    };

    function addShakeTrauma(amount) {
        const strength = persisted.profile.shakeIntensity ?? 0.8;
        if (prefersReducedMotion() || strength <= 0.01) return;
        shakeState.trauma = Math.min(1, shakeState.trauma + amount);
        if (!shakeState.rafId) {
            shakeState.lastTs = performance.now();
            shakeState.rafId = requestAnimationFrame(stepTraumaShake);
        }
    }

    function stepTraumaShake(now) {
        const target = document.getElementById('dossier-content');
        const strength = persisted.profile.shakeIntensity ?? 0.8;
        if (!target || prefersReducedMotion() || strength <= 0.01 || shakeState.trauma <= 0.002) {
            shakeState.trauma = 0;
            shakeState.rafId = null;
            if (target) target.style.transform = '';
            return;
        }
        const dt = Math.min(0.05, Math.max(0.001, (now - shakeState.lastTs) / 1000));
        shakeState.lastTs = now;
        shakeState.trauma = Math.max(0, shakeState.trauma - 1.65 * dt);
        shakeState.t += dt * 32;

        const power = shakeState.trauma * shakeState.trauma * strength;
        const ox = 9 * power * Math.sin(shakeState.t * 1.7);
        const oy = 6 * power * Math.sin(shakeState.t * 2.3);
        const rot = 0.55 * power * Math.sin(shakeState.t * 1.1);
        target.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

        if (shakeState.trauma > 0.002) {
            shakeState.rafId = requestAnimationFrame(stepTraumaShake);
        } else {
            shakeState.trauma = 0;
            shakeState.rafId = null;
            target.style.transform = '';
        }
    }

    // Non-blocking micro hit-stop / vignette pulse (overlapping-safe)
    let vignetteToken = 0;
    function triggerImpactVignette(tone, durationMs) {
        if (prefersReducedMotion() || persisted.profile.reduceFlashes) return;
        const vig = document.getElementById('hitstop-vignette');
        if (!vig) return;
        vignetteToken += 1;
        const myToken = vignetteToken;
        vig.classList.remove('active-gold', 'active-red');
        vig.classList.add(tone === 'gold' ? 'active-gold' : 'active-red');
        setTimeout(() => {
            if (myToken === vignetteToken) {
                vig.classList.remove('active-gold', 'active-red');
            }
        }, Math.min(140, Math.max(60, durationMs || 95)));
    }

    // HiDPI FX Canvas with single cancellable rAF loop
    let fxRafId = null;
    function spawnFxParticles(kind, origin) {
        if (prefersReducedMotion()) return;
        const canvas = document.getElementById('fx-canvas');
        if (!canvas || !canvas.getContext) return;
        if (fxRafId) {
            cancelAnimationFrame(fxRafId);
            fxRafId = null;
        }
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(2, global.devicePixelRatio || 1);
        const vw = global.innerWidth;
        const vh = global.innerHeight;
        canvas.width = Math.round(vw * dpr);
        canvas.height = Math.round(vh * dpr);
        canvas.style.width = `${vw}px`;
        canvas.style.height = `${vh}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const cx = origin && typeof origin.x === 'number' ? origin.x : vw * 0.5;
        const cy = origin && typeof origin.y === 'number' ? origin.y : vh * 0.44;

        let colors = ['#c99e32', '#f0cc69', '#e7d9bc'];
        let count = 16;
        let shape = 'spark';
        if (kind === 'stamp_success') {
            colors = ['#185c39', '#5ed493', '#c99e32', '#f0cc69'];
            count = 36;
            shape = 'ink';
        } else if (kind === 'stamp_fail') {
            colors = ['#991b1b', '#c92a2a', '#d5c29d', '#4a3d31'];
            count = 34;
            shape = 'ink';
        } else if (kind === 'breakthrough') {
            colors = ['#c92a2a', '#f0cc69', '#e7d9bc'];
            count = 28;
            shape = 'spark';
        } else if (kind === 'gold_spark') {
            colors = ['#c99e32', '#f0cc69', '#fff3cc'];
            count = 16;
            shape = 'spark';
        }

        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (shape === 'ink' ? 2.4 : 1.8) + Math.random() * (shape === 'ink' ? 6.4 : 4.8);
            particles.push({
                x: cx + (Math.random() - 0.5) * 44,
                y: cy + (Math.random() - 0.5) * 24,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.4,
                size: (shape === 'ink' ? 2.4 : 2.0) + Math.random() * 4.2,
                rot: Math.random() * Math.PI,
                vrot: (Math.random() - 0.5) * 0.2,
                alpha: 1,
                color: colors[i % colors.length],
                decay: 0.02 + Math.random() * 0.018,
                shape
            });
        }

        function frame() {
            ctx.clearRect(0, 0, vw, vh);
            let alive = false;
            for (const p of particles) {
                if (p.alpha <= 0.02) continue;
                alive = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15;
                p.vx *= 0.97;
                p.rot += p.vrot;
                p.alpha -= p.decay;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                if (p.shape === 'spark') {
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size);
                    ctx.lineTo(p.size * 0.55, 0);
                    ctx.lineTo(0, p.size);
                    ctx.lineTo(-p.size * 0.55, 0);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            if (alive) {
                fxRafId = requestAnimationFrame(frame);
            } else {
                ctx.clearRect(0, 0, vw, vh);
                fxRafId = null;
            }
        }
        fxRafId = requestAnimationFrame(frame);
    }

    function getElementCenter(el) {
        if (!el || !el.getBoundingClientRect) return null;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return null;
        return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
    }

    // Unified Feedback Dispatcher (small | medium | large)
    function triggerFeedback(tier, origin, opts) {
        const o = opts || {};
        const pos = origin && origin.getBoundingClientRect ? getElementCenter(origin) : origin;

        if (tier === 'small') {
            if (o.sound === 'paper') AudioFX.playPaper();
            else if (o.sound === 'lock') AudioFX.playLockClick();
            else if (o.sound === 'pin') AudioFX.playPinSnap();
            else if (o.sound === 'folder') AudioFX.playFolderOpen();
            else if (o.sound !== 'none') AudioFX.playTypeClick();
            return;
        }

        if (tier === 'medium') {
            addShakeTrauma(0.24);
            spawnFxParticles(o.particles || 'gold_spark', pos);
            if (o.sound === 'unlock') AudioFX.playLockUnlock();
            else if (o.sound === 'medal') AudioFX.playMedal();
            else if (o.sound === 'breakthrough') AudioFX.playBreakthrough();
            else if (o.sound === 'pin') AudioFX.playPinSnap();
            return;
        }

        if (tier === 'large') {
            addShakeTrauma(o.trauma || 0.62);
            triggerImpactVignette(o.vignette || 'red', o.hitStopMs || 95);
            if (o.particles !== 'none') {
                spawnFxParticles(o.particles || 'breakthrough', pos);
            }
            if (o.sound === 'stamp') AudioFX.playStamp();
            else if (o.sound === 'error') AudioFX.playError();
            else if (o.sound === 'breakthrough') AudioFX.playBreakthrough();
        }
    }

    /* =========================================================================
       4. PATENTES, CONQUISTAS & OVERLAY STACK COM FOCUS TRAP
       ========================================================================= */
    function calculateCaseRank(score, perfect) {
        if (!perfect) return 'Recruta';
        if (score >= 95) return 'Mestre da Dedução';
        if (score >= 80) return 'Inspetor Chefe';
        if (score >= 65) return 'Investigador Sênior';
        return 'Investigador';
    }

    function computeCareerStats() {
        const campaign = getCampaignCases();
        const parallel = getParallelCases();
        let solvedCampaign = 0;
        let solvedParallel = 0;
        let totalScore = 0;

        campaign.forEach(c => {
            const p = ensureCaseProgress(c.id);
            if (p.solved) {
                solvedCampaign++;
                totalScore += (p.bestScore || 0);
            }
        });
        parallel.forEach(c => {
            const p = ensureCaseProgress(c.id);
            if (p.solved) {
                solvedParallel++;
                totalScore += (p.bestScore || 0);
            }
        });
        const totalSolvedOfficial = solvedCampaign + solvedParallel;
        const customSolved = (persisted.customCases || []).filter(c => ensureCaseProgress(c.id).solved).length;
        const ranks = global.MISTERY_RANKS || [];
        let currentRank = ranks[0] || { title: 'Cadete', tier: 0, minPoints: 0 };
        let nextRank = null;
        for (let i = 0; i < ranks.length; i++) {
            if (totalScore >= ranks[i].minPoints) {
                currentRank = ranks[i];
                nextRank = ranks[i + 1] || null;
            }
        }
        const medalsUnlocked = Object.keys(persisted.achievements || {}).length;
        return {
            solvedOfficial: solvedCampaign,
            totalOfficial: campaign.length,
            solvedParallel,
            totalParallel: parallel.length,
            customSolved,
            totalCustom: (persisted.customCases || []).length,
            totalScore,
            avgScore: totalSolvedOfficial > 0 ? Math.round(totalScore / totalSolvedOfficial) : 0,
            currentRank,
            nextRank,
            medalsUnlocked,
            totalMedals: (global.MISTERY_ACHIEVEMENTS || []).length,
            puzzlesSolved: persisted.profile.puzzlesSolvedCount || 0,
            wrongEndingsCount: (persisted.profile.wrongEndingsSeen || []).length
        };
    }

    function unlockAchievement(id) {
        if (persisted.achievements[id]) return false;
        const meta = (global.MISTERY_ACHIEVEMENTS || []).find(a => a.id === id);
        if (!meta) return false;
        persisted.achievements[id] = { unlockedAt: new Date().toISOString() };
        savePersistedData();
        triggerFeedback('medium', null, { sound: 'medal', particles: 'gold_spark' });
        showToast(`Medalha Desbloqueada: ${meta.title}!`);
        return true;
    }

    function evaluateAchievements(contextCase, attempt) {
        const campaign = getCampaignCases();
        const parallel = getParallelCases();
        if (attempt && attempt.perfect && contextCase) {
            unlockAchievement('first_blood');
            const prog = ensureCaseProgress(contextCase.id);
            if (prog.hintsUsed === 0) unlockAchievement('no_hints');
            if (!prog.notebookOpened) unlockAchievement('lone_wolf');
            if (prog.authority === 100) unlockAchievement('iron_badge');
            if (getVisibleEvidences(contextCase).length >= contextCase.evidences.length) {
                unlockAchievement('thorough_investigator');
            }

            const culpritId = contextCase.solution.culpritId;
            const confronted = prog.confrontedSuspects || [];
            if (confronted.length > 0 && confronted.every(sid => sid === culpritId)) {
                unlockAchievement('straight_to_point');
            }
            if (contextCase.id === 'caso-06') {
                unlockAchievement('sahur_fall');
            }
            if (contextCase.isParallel) {
                unlockAchievement('parallel_sleuth');
                if (parallel.length > 0 && parallel.every(c => ensureCaseProgress(c.id).solved)) {
                    unlockAchievement('cold_case_closer');
                }
            }
            if (campaign.length > 0 && campaign.every(c => ensureCaseProgress(c.id).solved)) {
                unlockAchievement('grand_detective');
            }
        }
        if ((persisted.profile.puzzlesSolvedCount || 0) >= 3) {
            unlockAchievement('locksmith');
        }
        if (persisted.profile.comparatorUsed) {
            unlockAchievement('split_vision');
        }
        if ((persisted.profile.wrongEndingsSeen || []).length >= 1) {
            unlockAchievement('wrong_turn');
        }
        if ((persisted.customCases || []).length >= 1) {
            unlockAchievement('community_sleuth');
        }
        if (contextCase) {
            const prog = ensureCaseProgress(contextCase.id);
            if ((prog.corkboard?.confirmedKeys?.length || 0) >= 3) {
                unlockAchievement('red_string_master');
            }
        }
    }

    // Overlay Stack with Focus Trap & Focus Restoration
    const backdrop = document.getElementById('backdrop');
    const notebookDrawer = document.getElementById('notebook-drawer');
    const hintModal = document.getElementById('hint-modal');
    const puzzleModal = document.getElementById('puzzle-modal');
    const comparatorModal = document.getElementById('comparator-modal');
    const authorityModal = document.getElementById('authority-modal');
    const customCaseModal = document.getElementById('custom-case-modal');
    const dialogModal = document.getElementById('dialog-modal');
    const shortcutsModal = document.getElementById('shortcuts-modal');

    const overlayStack = [];

    function getFocusableElements(container) {
        if (!container) return [];
        const sel = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(container.querySelectorAll(sel)).filter(el => {
            if (el.hidden || el.closest('[hidden]')) return false;
            return el.offsetParent !== null || getComputedStyle(el).position === 'fixed';
        });
    }

    function closeAudioPopover(restoreFocus) {
        const audioPop = document.getElementById('audio-popover');
        const btn = document.getElementById('btn-audio-settings');
        if (audioPop && !audioPop.hidden) {
            audioPop.hidden = true;
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
                if (restoreFocus) btn.focus();
            }
            return true;
        }
        return false;
    }

    function setOverlayVisibility(el, visible) {
        if (!el) return;
        el.classList.toggle('open', visible);
        if (visible) {
            el.removeAttribute('aria-hidden');
            el.inert = false;
            el.removeAttribute('inert');
        } else if (el === notebookDrawer) {
            el.setAttribute('aria-hidden', 'true');
            el.inert = true;
        }
    }

    function pushOverlay(el, opts) {
        if (!el) return;
        const o = opts || {};
        closeAudioPopover(false);
        const existingIdx = overlayStack.findIndex(item => item.el === el);
        if (existingIdx >= 0) {
            overlayStack.splice(existingIdx, 1);
        }
        // Hide visually any previous overlay underneath while preserving stack
        overlayStack.forEach(item => setOverlayVisibility(item.el, false));

        const entry = {
            el,
            locked: Boolean(o.locked),
            returnFocusEl: document.activeElement,
            returnFocusSelector: o.returnFocusSelector || null,
            onClose: o.onClose || null
        };
        overlayStack.push(entry);
        if (backdrop) backdrop.classList.add('open');
        setOverlayVisibility(el, true);

        // Focus first interactive element inside overlay synchronously (no rAF race with rapid Tab input)
        const target = o.initialFocus && el.contains(o.initialFocus)
            ? o.initialFocus
            : getFocusableElements(el)[0];
        if (target && typeof target.focus === 'function') {
            target.focus();
        }
    }

    function popOverlay(force) {
        if (overlayStack.length === 0) return false;
        const top = overlayStack[overlayStack.length - 1];
        if (top.locked && !force) return false;

        overlayStack.pop();
        setOverlayVisibility(top.el, false);
        if (typeof top.onClose === 'function') {
            try { top.onClose(); } catch (_) { }
        }

        if (overlayStack.length > 0) {
            const nextTop = overlayStack[overlayStack.length - 1];
            setOverlayVisibility(nextTop.el, true);
            const first = getFocusableElements(nextTop.el)[0];
            if (first) first.focus();
        } else {
            if (backdrop) backdrop.classList.remove('open');
            let restored = false;
            if (top.returnFocusEl && document.contains(top.returnFocusEl) && typeof top.returnFocusEl.focus === 'function') {
                top.returnFocusEl.focus();
                restored = document.activeElement === top.returnFocusEl;
            }
            if (!restored && top.returnFocusSelector) {
                const fallback = document.querySelector(top.returnFocusSelector);
                if (fallback && typeof fallback.focus === 'function') {
                    fallback.focus();
                    restored = true;
                }
            }
            if (!restored) {
                const mainEl = document.getElementById('main-content');
                if (mainEl && typeof mainEl.focus === 'function') mainEl.focus();
            }
        }
        return true;
    }

    function closeOverlays(force) {
        closeAudioPopover(false);
        while (overlayStack.length > 0) {
            const top = overlayStack[overlayStack.length - 1];
            if (top.locked && !force) break;
            popOverlay(force);
        }
    }

    function getTopOverlay() {
        return overlayStack.length > 0 ? overlayStack[overlayStack.length - 1] : null;
    }

    // Diegetic Prompt & Confirm Modal (replaces native window.prompt / window.confirm)
    let activeDialogResolve = null;

    function openDiegeticDialog(config) {
        const titleEl = document.getElementById('dialog-modal-title');
        const msgEl = document.getElementById('dialog-modal-message');
        const inputWrap = document.getElementById('dialog-input-wrap');
        const inputLabel = document.getElementById('dialog-input-label');
        const inputEl = document.getElementById('dialog-input');
        const confirmBtn = document.getElementById('dialog-confirm');

        titleEl.textContent = config.title || 'Despacho da Divisão';
        titleEl.classList.toggle('modal-title-danger', Boolean(config.danger));
        msgEl.textContent = config.message || '';

        confirmBtn.textContent = config.confirmText || 'Confirmar';
        confirmBtn.classList.toggle('btn-danger', Boolean(config.danger));
        confirmBtn.classList.toggle('btn-gold', !config.danger);

        if (config.mode === 'prompt') {
            inputWrap.hidden = false;
            inputLabel.textContent = config.label || 'Valor';
            inputEl.value = config.defaultValue || '';
        } else {
            inputWrap.hidden = true;
            inputEl.value = '';
        }

        activeDialogResolve = config.onConfirm || null;
        pushOverlay(dialogModal, {
            initialFocus: config.mode === 'prompt' ? inputEl : confirmBtn,
            returnFocusSelector: config.returnFocusSelector || null,
            onClose: () => {
                activeDialogResolve = null;
            }
        });
        if (config.mode === 'prompt' && typeof inputEl.select === 'function') {
            inputEl.select();
        }
    }

    /* =========================================================================
       5. AUTORIDADE & ÁUDIO DINÂMICO DE TENSÃO
       ========================================================================= */
    function updateTensionAudio() {
        if (state.view !== 'case') {
            AudioFX.setTension(0);
            return;
        }
        const prog = ensureCaseProgress(state.currentCaseId);
        if (state.activeTab === 'accuse') {
            AudioFX.setTension(prog.authority <= 40 ? 3 : 2);
        } else if (prog.authority <= 40) {
            AudioFX.setTension(1);
        } else {
            AudioFX.setTension(0);
        }
    }

    function applyAuthorityPenalty(caseObj, amount, reason, opts) {
        const o = opts || {};
        const prog = ensureCaseProgress(caseObj.id);
        prog.authority = Math.max(0, prog.authority - amount);
        savePersistedData();
        updateTensionAudio();
        if (!o.silentFeedback) {
            triggerFeedback('large', null, { sound: 'error', trauma: 0.55, vignette: 'red', particles: 'none' });
        }
        showToast(`${reason} (-${amount}% Autoridade)`);
        if (prog.authority <= 0) {
            openAuthorityLockoutModal(caseObj);
        }
    }

    function openAuthorityLockoutModal(caseObj) {
        document.getElementById('authority-modal-case').textContent = `${caseObj.code} — ${caseObj.title}`;
        closeOverlays(false);
        pushOverlay(authorityModal, {
            locked: true,
            initialFocus: document.getElementById('btn-reopen-inquiry'),
            returnFocusSelector: '#main-content'
        });
    }

    /* =========================================================================
       6. RENDERIZAÇÃO PRINCIPAL (HOME / CARREIRA VS DOSSIÊ DO CASO)
       ========================================================================= */
    function renderAll() {
        updateTensionAudio();
        const homeContainer = document.getElementById('home-view');
        const caseBar = document.getElementById('case-selector');
        const workspace = document.getElementById('case-workspace');
        const btnHint = document.getElementById('btn-hint');
        const btnCompare = document.getElementById('btn-comparator-open');
        const btnHome = document.getElementById('btn-home-nav');

        if (state.view === 'home') {
            homeContainer.hidden = false;
            caseBar.hidden = true;
            workspace.hidden = true;
            if (btnHint) btnHint.hidden = true;
            if (btnCompare) btnCompare.hidden = true;
            if (btnHome) btnHome.classList.add('btn-gold');
            renderHomeView(homeContainer);
            return;
        }

        homeContainer.hidden = true;
        caseBar.hidden = false;
        workspace.hidden = false;
        if (btnHint) btnHint.hidden = false;
        if (btnCompare) btnCompare.hidden = false;
        if (btnHome) btnHome.classList.remove('btn-gold');

        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        if (!state.selectedSuspectId || !c.suspects.some(s => s.id === state.selectedSuspectId)) {
            state.selectedSuspectId = c.suspects[0].id;
        }
        renderCaseSelector();
        updateCounters();
        renderAuthorityBar();
        renderActiveTab();
        document.getElementById('hint-counter').textContent = `${prog.hintsUsed}/${(c.hints || []).length}`;
        document.getElementById('notebook-case-label').textContent = `${c.code} — ${c.title}`;
        document.getElementById('notebook-textarea').value = prog.notes || '';
    }

    function openCase(caseId) {
        const c = getCaseById(caseId);
        if (!isCaseUnlocked(c)) {
            const req = getCaseById(c.unlockRequires);
            showToast(`Resolva "${req.title}" antes (ou ative o Modo Livre na Central).`);
            return;
        }
        cancelTypewriter();
        triggerFeedback('small', null, { sound: 'folder' });
        state.view = 'case';
        state.currentCaseId = c.id;
        state.selectedSuspectId = c.suspects[0].id;
        state.selectedHotspotId = c.hotspots[0] ? c.hotspots[0].id : null;
        state.interrogationFeedback = null;
        state.suspectMoods = {};
        state.recoilSuspectId = null;
        state.showOfficialRevealAfterFail = false;
        state.activeTab = 'scene';
        state.corkboard.connectMode = false;
        state.corkboard.pendingFrom = null;
        state.corkboard.autoFitAppliedForCase = null;
        updateTabButtons();
        renderAll();
        global.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    global.switchToCase = openCase;

    /* =========================================================================
       7. TELA INICIAL, PERFIL DE CARREIRA, CAMPANHA & CASOS PARALELOS
       ========================================================================= */
    function renderCaseCardHTML(c) {
        const prog = ensureCaseProgress(c.id);
        const unlocked = isCaseUnlocked(c);
        const hideFinalPreview = c.id === 'caso-06' && !unlocked && !isFinalCampaignRevealed();
        const displayTitle = hideFinalPreview ? 'Dossiê Ultra-Secreto (Ato Final)' : c.title;
        const displaySummary = hideFinalPreview
            ? 'Arquivo selado pela Corregedoria. Encerre os inquéritos anteriores da campanha para liberar o confronto decisivo da Operação Madrugada.'
            : (c.summary.length > 148 ? c.summary.slice(0, 148) + '...' : c.summary);

        const statusLabel = prog.solved
            ? `<span class="stamp-pill stamp-solved">RESOLVIDO (${prog.bestScore} PTS)</span>`
            : unlocked
                ? c.isTutorial
                    ? `<span class="stamp-pill stamp-open">TUTORIAL</span>`
                    : c.isParallel
                        ? `<span class="stamp-pill stamp-parallel">PARALELO</span>`
                        : `<span class="stamp-pill stamp-open">EM ABERTO</span>`
                : `<span class="stamp-pill stamp-locked">BLOQUEADO</span>`;

        const metaText = c.isTutorial
            ? `${c.code} &bull; 5 min`
            : `${c.code} &bull; ${c.difficulty}`;

        return `
            <article class="campaign-card ${unlocked ? '' : 'locked'} ${prog.solved ? 'solved' : ''}">
                <div class="campaign-card-top">
                    <div>
                        <h4 class="campaign-card-title">${escapeHTML(displayTitle)}</h4>
                        <div class="campaign-card-meta">${metaText}</div>
                    </div>
                    ${statusLabel}
                </div>
                <p class="campaign-card-desc">${escapeHTML(displaySummary)}</p>
                <div class="campaign-card-foot">
                    <span class="mono-label-dark">
                        ${c.suspects.length} Suspeitos &bull; ${c.evidences.length} Provas${c.isCustom ? ' &bull; COMUNIDADE' : ''}
                    </span>
                    <div class="campaign-card-actions">
                        ${c.isCustom ? `<button type="button" class="btn btn-sm btn-danger btn-remove-custom" data-case-id="${escapeHTML(c.id)}">${icon('trash', 13)}<span>Excluir</span></button>` : ''}
                        <button type="button" class="btn btn-sm ${unlocked ? 'btn-gold' : ''} btn-open-case" data-case-id="${escapeHTML(c.id)}" ${unlocked ? '' : 'disabled'}>
                            ${unlocked
                                ? `<span>${prog.solved ? 'Reabrir' : 'Investigar'}</span>${icon('arrow_right', 13)}`
                                : `${icon('lock', 13)}<span>Bloqueado</span>`}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderHomeView(host) {
        const stats = computeCareerStats();
        const campaignCases = getCampaignCases();
        const parallelCases = getParallelCases();
        const customCases = Array.isArray(persisted.customCases) ? persisted.customCases : [];
        const allCases = getAllCases();
        const pctNext = stats.nextRank
            ? Math.min(100, Math.round(((stats.totalScore - stats.currentRank.minPoints) / (stats.nextRank.minPoints - stats.currentRank.minPoints)) * 100))
            : 100;

        const cluesRevealed = campaignCases.filter(c => ensureCaseProgress(c.id).solved);
        const finaleSolved = isFinalCampaignRevealed();
        const campaignTitle = finaleSolved
            ? 'Operação Madrugada — Rede "Tung Tung Tung Sahur" Desmantelada'
            : 'Operação Madrugada — Dossiês Interligados';

        let activePanelHTML = '';
        if (state.homeTab === 'campaign') {
            activePanelHTML = `
                <div class="home-panel-head">
                    <h3>${escapeHTML(campaignTitle)}</h3>
                    <span class="mono-label-dark">${stats.solvedOfficial}/${stats.totalOfficial} encerrados</span>
                </div>
                <div class="campaign-grid">
                    ${campaignCases.map(renderCaseCardHTML).join('')}
                </div>
                <div class="conspiracy-box">
                    <div class="conspiracy-head">
                        <span class="mono-label-dark mono-label-danger-dark">
                            ${finaleSolved
                                ? 'Força-Tarefa 03h33 — Organograma Completo Revelado'
                                : `Força-Tarefa 03h33 — Conexões Descobertas (${cluesRevealed.length}/${campaignCases.length})`}
                        </span>
                    </div>
                    ${cluesRevealed.length === 0
                        ? `<p class="helper-text-dark">Encerre os dossiês da campanha para conectar pistas aparentemente isoladas e descobrir quem opera nas sombras da madrugada.</p>`
                        : `<ul class="conspiracy-list">
                            ${cluesRevealed.map(c => `<li><strong>${escapeHTML(c.code)} (${escapeHTML(c.title)}):</strong> ${escapeHTML(c.solution.syndicateClue)}</li>`).join('')}
                           </ul>`
                    }
                </div>
            `;
        } else if (state.homeTab === 'parallel') {
            const combined = parallelCases.concat(customCases);
            activePanelHTML = `
                <div class="home-panel-head">
                    <h3>Casos Paralelos &amp; Dossiês Avulsos</h3>
                    <span class="mono-label-dark">${stats.solvedParallel}/${stats.totalParallel} oficiais${customCases.length ? ` &bull; ${customCases.length} da comunidade` : ''}</span>
                </div>
                <p class="helper-text-dark helper-mb">
                    Investigações independentes da campanha principal, liberadas desde o início para testar novas deduções, cadeados e cifras.
                </p>
                <div class="campaign-grid">
                    ${combined.map(renderCaseCardHTML).join('')}
                </div>
            `;
        } else if (state.homeTab === 'medals') {
            activePanelHTML = `
                <div class="home-panel-head">
                    <h3>Medalhas &amp; Conquistas</h3>
                    <span class="mono-label-dark">${stats.medalsUnlocked} de ${stats.totalMedals} conquistadas</span>
                </div>
                <div class="medals-grid">
                    ${(global.MISTERY_ACHIEVEMENTS || []).map(ach => {
                        const got = Boolean(persisted.achievements[ach.id]);
                        return `
                            <div class="medal-card ${got ? 'unlocked' : 'locked'}">
                                <div class="medal-icon">${Art.getMedalSVG(ach.icon, got)}</div>
                                <div>
                                    <div class="medal-title">${escapeHTML(ach.title)}</div>
                                    <div class="medal-desc">${escapeHTML(ach.desc)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            activePanelHTML = `
                <div class="home-panel-head">
                    <h3>Backup de Carreira &amp; Casos da Comunidade (JSON)</h3>
                    <span class="mono-label-dark">Compatível com Save v1 / v2</span>
                </div>
                <div class="data-actions-grid">
                    <div class="data-card">
                        <h4>Progresso do Detetive</h4>
                        <p>Exporte histórico, notas, conexões do mural e medalhas em JSON ou restaure um save validado em outro dispositivo.</p>
                        <div class="data-btn-row">
                            <button type="button" class="btn btn-gold" id="btn-export-save">Exportar Save JSON</button>
                            <label class="btn btn-file">
                                <span>Importar Save JSON</span>
                                <input type="file" id="input-import-save" accept=".json,application/json" hidden />
                            </label>
                            <button type="button" class="btn btn-danger" id="btn-reset-save">Zerar Carreira</button>
                        </div>
                    </div>

                    <div class="data-card">
                        <h4>Casos da Comunidade</h4>
                        <p>Importe novos mistérios no formato JSON do motor <code>CASES</code> ou baixe o modelo validado pronto para editar.</p>
                        <div class="data-btn-row">
                            <label class="btn btn-gold btn-file">
                                <span>Importar Caso (.json)</span>
                                <input type="file" id="input-import-case-file" accept=".json,application/json" hidden />
                            </label>
                            <button type="button" class="btn" id="btn-paste-case-modal">Colar JSON do Caso</button>
                            <button type="button" class="btn" id="btn-download-template">Baixar Modelo JSON</button>
                        </div>
                    </div>
                </div>
            `;
        }

        host.innerHTML = `
            <div class="home-grid">
                <section class="career-banner" aria-label="Credencial do Detetive">
                    <div class="career-identity">
                        <div class="career-badge-wrap">${Art.getBadgeSVG(stats.currentRank.tier)}</div>
                        <div class="career-info">
                            <div class="career-name-row">
                                <h2 class="career-name">${escapeHTML(persisted.profile.name)}</h2>
                                <button type="button" class="btn btn-sm" id="btn-edit-name">${icon('edit', 13)}<span>Renomear</span></button>
                            </div>
                            <div class="career-rank-line">
                                Patente: <strong>${escapeHTML(stats.currentRank.title)}</strong> &bull; <span class="tabular">${stats.totalScore}</span> pts
                            </div>
                            <div class="xp-track" role="progressbar" aria-label="Progresso para próxima patente" aria-valuenow="${pctNext}" aria-valuemin="0" aria-valuemax="100">
                                <div class="xp-fill" style="width:${pctNext}%"></div>
                            </div>
                            <div class="career-next-rank">
                                ${stats.nextRank ? `Próxima patente (${stats.nextRank.title}): faltam ${Math.max(0, stats.nextRank.minPoints - stats.totalScore)} pts` : 'Patente máxima da Divisão alcançada.'}
                            </div>
                        </div>
                        <div class="career-actions">
                            <button type="button" class="btn btn-gold" id="btn-continue-campaign">
                                <span>${stats.solvedOfficial === 0 ? 'Iniciar Caso 00 (Tutorial)' : 'Continuar Campanha'}</span>
                                ${icon('arrow_right', 14)}
                            </button>
                            <label class="toggle-pill">
                                <input type="checkbox" id="chk-free-mode" ${persisted.profile.freeMode ? 'checked' : ''} />
                                <span>Modo Livre (Desbloquear Todos)</span>
                            </label>
                        </div>
                    </div>

                    <div class="career-stats-strip">
                        <div class="career-stat-item">
                            <span class="stat-label">Campanha</span>
                            <strong>${stats.solvedOfficial}/${stats.totalOfficial}</strong>
                        </div>
                        <div class="career-stat-item">
                            <span class="stat-label">Paralelos</span>
                            <strong>${stats.solvedParallel}/${stats.totalParallel}</strong>
                        </div>
                        <div class="career-stat-item">
                            <span class="stat-label">Média</span>
                            <strong>${stats.avgScore} pts</strong>
                        </div>
                        <div class="career-stat-item">
                            <span class="stat-label">Enigmas</span>
                            <strong>${stats.puzzlesSolved}</strong>
                        </div>
                        <div class="career-stat-item">
                            <span class="stat-label">Medalhas</span>
                            <strong>${stats.medalsUnlocked}/${stats.totalMedals}</strong>
                        </div>
                    </div>
                </section>

                <section class="home-cabinet" aria-label="Arquivo de Dossiês">
                    <div class="home-tabs" role="tablist" aria-label="Seções da Central">
                        <button type="button" class="home-tab-btn ${state.homeTab === 'campaign' ? 'active' : ''}" role="tab" id="htab-campaign" aria-selected="${state.homeTab === 'campaign'}" aria-controls="home-tab-panel" tabindex="${state.homeTab === 'campaign' ? '0' : '-1'}" data-home-tab="campaign">
                            <span>Campanha</span>
                            <span class="home-tab-count">${campaignCases.length}</span>
                        </button>
                        <button type="button" class="home-tab-btn ${state.homeTab === 'parallel' ? 'active' : ''}" role="tab" id="htab-parallel" aria-selected="${state.homeTab === 'parallel'}" aria-controls="home-tab-panel" tabindex="${state.homeTab === 'parallel' ? '0' : '-1'}" data-home-tab="parallel">
                            <span>Casos Paralelos</span>
                            <span class="home-tab-count">${parallelCases.length + customCases.length}</span>
                        </button>
                        <button type="button" class="home-tab-btn ${state.homeTab === 'medals' ? 'active' : ''}" role="tab" id="htab-medals" aria-selected="${state.homeTab === 'medals'}" aria-controls="home-tab-panel" tabindex="${state.homeTab === 'medals' ? '0' : '-1'}" data-home-tab="medals">
                            <span>Medalhas</span>
                            <span class="home-tab-count">${stats.medalsUnlocked}/${stats.totalMedals}</span>
                        </button>
                        <button type="button" class="home-tab-btn ${state.homeTab === 'data' ? 'active' : ''}" role="tab" id="htab-data" aria-selected="${state.homeTab === 'data'}" aria-controls="home-tab-panel" tabindex="${state.homeTab === 'data' ? '0' : '-1'}" data-home-tab="data">
                            <span>Backup &amp; JSON</span>
                        </button>
                    </div>
                    <div class="home-panel" id="home-tab-panel" role="tabpanel" aria-labelledby="htab-${state.homeTab}">
                        ${activePanelHTML}
                    </div>
                </section>
            </div>
        `;

        // Bindings Home View
        host.querySelector('#btn-edit-name').addEventListener('click', () => {
            openDiegeticDialog({
                mode: 'prompt',
                title: 'Atualizar Credencial',
                message: 'Informe o nome impresso na sua credencial da Divisão de Homicídios.',
                label: 'Nome do Detetive',
                defaultValue: persisted.profile.name,
                confirmText: 'Salvar Nome',
                returnFocusSelector: '#btn-edit-name',
                onConfirm: val => {
                    const clean = String(val || '').trim().slice(0, 40);
                    if (!clean) {
                        showToast('Informe um nome válido para a credencial.');
                        return false;
                    }
                    persisted.profile.name = clean;
                    savePersistedData();
                    renderHomeView(host);
                    showToast(`Credencial atualizada para "${clean}".`);
                    return true;
                }
            });
        });

        host.querySelector('#btn-continue-campaign').addEventListener('click', () => {
            const nextUnsolved = campaignCases.find(c => !ensureCaseProgress(c.id).solved && isCaseUnlocked(c));
            openCase((nextUnsolved || allCases[0]).id);
        });

        host.querySelector('#chk-free-mode').addEventListener('change', e => {
            persisted.profile.freeMode = e.target.checked;
            savePersistedData();
            triggerFeedback('small', null, { sound: 'click' });
            renderHomeView(host);
            showToast(e.target.checked ? 'Modo Livre ativado: todos os dossiês liberados!' : 'Modo Campanha progressiva restaurado.');
        });

        // Home Tabs click + arrow keyboard navigation
        const homeTabs = Array.from(host.querySelectorAll('.home-tab-btn'));
        homeTabs.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                triggerFeedback('small', null, { sound: 'paper' });
                state.homeTab = btn.dataset.homeTab;
                renderHomeView(host);
            });
            btn.addEventListener('keydown', e => {
                let targetIdx = null;
                if (e.key === 'ArrowRight') targetIdx = (idx + 1) % homeTabs.length;
                else if (e.key === 'ArrowLeft') targetIdx = (idx - 1 + homeTabs.length) % homeTabs.length;
                else if (e.key === 'Home') targetIdx = 0;
                else if (e.key === 'End') targetIdx = homeTabs.length - 1;
                if (targetIdx !== null) {
                    e.preventDefault();
                    state.homeTab = homeTabs[targetIdx].dataset.homeTab;
                    triggerFeedback('small', null, { sound: 'paper' });
                    renderHomeView(host);
                    const nextBtn = host.querySelector(`.home-tab-btn[data-home-tab="${state.homeTab}"]`);
                    if (nextBtn) nextBtn.focus();
                }
            });
        });

        host.querySelectorAll('.btn-open-case').forEach(btn => {
            btn.addEventListener('click', () => openCase(btn.dataset.caseId));
        });

        host.querySelectorAll('.btn-remove-custom').forEach(btn => {
            btn.addEventListener('click', () => {
                const cid = btn.dataset.caseId;
                const cObj = getCaseById(cid);
                openDiegeticDialog({
                    mode: 'confirm',
                    danger: true,
                    title: 'Excluir Caso Customizado',
                    message: `Remover permanentemente "${cObj ? cObj.title : cid}" da sua lista de casos da comunidade?`,
                    confirmText: 'Excluir Caso',
                    returnFocusSelector: '#htab-parallel',
                    onConfirm: () => {
                        persisted.customCases = (persisted.customCases || []).filter(x => x.id !== cid);
                        savePersistedData();
                        renderHomeView(host);
                        showToast('Caso customizado removido.');
                        return true;
                    }
                });
            });
        });

        const btnExport = host.querySelector('#btn-export-save');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                downloadJSON(`arquivo-confidencial-save-${new Date().toISOString().slice(0, 10)}.json`, persisted);
                showToast('Backup do progresso exportado em JSON.');
            });
        }

        const inputImportSave = host.querySelector('#input-import-save');
        if (inputImportSave) {
            inputImportSave.addEventListener('change', e => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                readFileAsText(file, text => handleSaveImport(text), () => { e.target.value = ''; });
            });
        }

        const btnReset = host.querySelector('#btn-reset-save');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                openDiegeticDialog({
                    mode: 'confirm',
                    danger: true,
                    title: 'Zerar Carreira do Detetive',
                    message: 'Esta ação apagará todo o progresso, pontuações, medalhas e anotações do caderno. Recomendamos exportar um backup JSON antes. Deseja prosseguir?',
                    confirmText: 'Apagar Tudo',
                    returnFocusSelector: '#btn-reset-save',
                    onConfirm: () => {
                        persisted = createEmptySave();
                        state.corkboard.undoByCase = {};
                        state.corkboard.redoByCase = {};
                        state.suspectMoods = {};
                        state.interrogationFeedback = null;
                        try { localStorage.removeItem(BACKUP_STORAGE_KEY); } catch (_) { }
                        savePersistedData();
                        applyPersistedAudioAndFeel();
                        syncAudioSettingsUI();
                        renderAll();
                        showToast('Carreira reiniciada.');
                        return true;
                    }
                });
            });
        }

        const inputImportCase = host.querySelector('#input-import-case-file');
        if (inputImportCase) {
            inputImportCase.addEventListener('change', e => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                readFileAsText(file, text => handleCustomCaseImport(text), () => { e.target.value = ''; });
            });
        }

        const btnPasteCase = host.querySelector('#btn-paste-case-modal');
        if (btnPasteCase) {
            btnPasteCase.addEventListener('click', openCustomCaseModal);
        }

        const btnTemplate = host.querySelector('#btn-download-template');
        if (btnTemplate) {
            btnTemplate.addEventListener('click', () => {
                downloadJSON('modelo-caso-arquivo-confidencial.json', global.MISTERY_CASE_TEMPLATE);
                showToast('Modelo JSON baixado.');
            });
        }
    }

    function handleSaveImport(jsonText) {
        try {
            const imported = JSON.parse(jsonText);
            const check = validateSaveObject(imported);
            if (!check.ok) {
                showToast(`Falha na importação: ${check.error}`);
                return false;
            }
            persisted = normalizeSaveData(imported);
            savePersistedData();
            applyPersistedAudioAndFeel();
            syncAudioSettingsUI();
            renderAll();
            triggerFeedback('medium', null, { sound: 'breakthrough', particles: 'gold_spark' });
            showToast('Progresso restaurado com sucesso!');
            return true;
        } catch (_) {
            showToast('Arquivo JSON corrompido ou ilegível — seu progresso atual foi mantido intacto.');
            return false;
        }
    }

    function downloadJSON(filename, obj) {
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function readFileAsText(file, cb, onDone) {
        const done = () => {
            if (typeof onDone === 'function') {
                try { onDone(); } catch (_) { }
            }
        };
        if (file && typeof file.text === 'function') {
            file.text().then(text => {
                cb(String(text || ''));
                done();
            }).catch(() => {
                showToast('Não foi possível ler o arquivo selecionado.');
                done();
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            cb(String(reader.result || ''));
            done();
        };
        reader.onerror = () => {
            showToast('Não foi possível ler o arquivo selecionado.');
            done();
        };
        reader.readAsText(file, 'utf-8');
    }

    function handleCustomCaseImport(jsonText) {
        try {
            const parsed = JSON.parse(jsonText);
            const res = global.validateCustomCase(parsed);
            if (!res.ok) {
                showToast(`Erro no caso: ${res.error}`);
                return false;
            }
            const existingIds = new Set(getAllCases().map(c => c.id));
            const cObj = res.caseObj;
            if (existingIds.has(cObj.id)) {
                cObj.id = `${cObj.id}-${Date.now().toString(36)}`;
            }
            persisted.customCases.push(cObj);
            savePersistedData();
            evaluateAchievements(null, null);
            triggerFeedback('medium', null, { sound: 'breakthrough', particles: 'gold_spark' });
            state.homeTab = 'parallel';
            renderAll();
            showToast(`Caso customizado "${cObj.title}" importado em Casos Paralelos!`);
            return true;
        } catch (_) {
            showToast('JSON malformado. Verifique chaves, vírgulas e aspas antes de importar.');
            return false;
        }
    }

    /* =========================================================================
       8. CASE SELECTOR & BARRA DE AUTORIDADE
       ========================================================================= */
    function renderCaseSelector() {
        const container = document.getElementById('case-selector');
        const cases = getAllCases();
        container.innerHTML = cases.map(c => {
            const prog = ensureCaseProgress(c.id);
            const unlocked = isCaseUnlocked(c);
            const activeClass = c.id === state.currentCaseId ? 'active' : '';
            const hideFinalTitle = c.id === 'caso-06' && !unlocked && !isFinalCampaignRevealed();
            const titleText = hideFinalTitle ? 'Dossiê Ultra-Secreto' : c.title;
            const statusBadge = prog.solved
                ? `<span class="stamp-pill stamp-solved">${prog.bestScore} PTS</span>`
                : unlocked
                    ? c.isTutorial
                        ? `<span class="stamp-pill stamp-open">TUTORIAL</span>`
                        : c.isParallel
                            ? `<span class="stamp-pill stamp-parallel">PARALELO</span>`
                            : `<span class="stamp-pill stamp-open">ABERTO</span>`
                    : `<span class="stamp-pill stamp-locked">TRANCADO</span>`;
            return `
                <button type="button" class="case-folder-btn ${activeClass} ${unlocked ? '' : 'locked'}" data-case-id="${escapeHTML(c.id)}" ${unlocked ? '' : 'disabled'}>
                    <div>
                        <div class="case-folder-meta">${escapeHTML(c.code)}</div>
                        <div class="case-folder-title">${escapeHTML(titleText)}</div>
                    </div>
                    ${statusBadge}
                </button>
            `;
        }).join('');

        container.querySelectorAll('.case-folder-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newId = btn.dataset.caseId;
                if (newId === state.currentCaseId) return;
                openCase(newId);
            });
        });
    }

    function renderAuthorityBar() {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const host = document.getElementById('authority-bar');
        if (!host) return;
        const pct = Math.max(0, Math.min(100, prog.authority));
        const shields = Math.ceil(pct / 20);
        const lowClass = pct <= 40 ? 'critical' : pct <= 60 ? 'warn' : '';

        host.className = `authority-bar ${lowClass}`;
        host.innerHTML = `
            <div class="authority-group">
                <span class="mono-label-dark">Autoridade do Detetive:</span>
                <div class="authority-pips" aria-label="Autoridade em ${pct} por cento">
                    ${[1, 2, 3, 4, 5].map(i => `<span class="auth-pip ${i <= shields ? 'on' : 'off'}"></span>`).join('')}
                </div>
                <strong class="tabular authority-pct">${pct}%</strong>
            </div>
            <div class="authority-group">
                <span class="authority-note">
                    ${pct <= 40 ? `${icon('alert', 14)}<span>Credibilidade crítica — novos erros suspendem o inquérito.</span>` : 'Confrontos errados (-20%) e mandados falsos (-40%) reduzem autoridade.'}
                </span>
                ${pct < 100 ? `<button type="button" class="btn btn-sm" id="btn-reopen-early">${icon('refresh', 13)}<span>Restaurar 100%</span></button>` : ''}
            </div>
        `;
        const reopenBtn = host.querySelector('#btn-reopen-early');
        if (reopenBtn) {
            reopenBtn.addEventListener('click', () => {
                prog.authority = 100;
                prog.reopenedCount = (prog.reopenedCount || 0) + 1;
                savePersistedData();
                updateTensionAudio();
                renderAuthorityBar();
                triggerFeedback('small', null, { sound: 'folder' });
                showToast('Autoridade restaurada para 100% pelo Conselho.');
            });
        }
    }

    function updateCounters() {
        const c = getCaseById(state.currentCaseId);
        document.getElementById('count-suspects').textContent = c.suspects.length;
        document.getElementById('count-evidence').textContent = `${getVisibleEvidences(c).length}/${c.evidences.length}`;
        const corkCountEl = document.getElementById('count-corkboard');
        if (corkCountEl) {
            const prog = ensureCaseProgress(c.id);
            corkCountEl.textContent = `${prog.corkboard.confirmedKeys.length}/${(c.keyConnections || []).length}`;
        }
    }

    function updateTabButtons() {
        const panel = document.getElementById('dossier-content');
        document.querySelectorAll('.tab-btn').forEach(b => {
            const isActive = b.dataset.tab === state.activeTab;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', String(isActive));
            b.setAttribute('tabindex', isActive ? '0' : '-1');
            if (isActive && panel) {
                panel.setAttribute('aria-labelledby', b.id);
            }
        });
        updateTensionAudio();
    }

    function switchCaseTab(tabName, focusTab) {
        const allowed = ['scene', 'suspects', 'evidence', 'corkboard', 'timeline', 'accuse'];
        if (!allowed.includes(tabName)) return;
        cancelTypewriter();
        triggerFeedback('small', null, { sound: 'paper' });
        state.activeTab = tabName;
        updateTabButtons();
        renderActiveTab();
        if (focusTab) {
            const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
            if (btn) btn.focus();
        }
    }

    function renderActiveTab() {
        const host = document.getElementById('dossier-content');
        if (!prefersReducedMotion()) {
            host.classList.remove('folder-enter');
            void host.offsetWidth;
            host.classList.add('folder-enter');
        }
        if (state.activeTab === 'scene') renderSceneTab(host);
        else if (state.activeTab === 'suspects') renderSuspectsTab(host);
        else if (state.activeTab === 'evidence') renderEvidenceTab(host);
        else if (state.activeTab === 'corkboard') renderCorkboardTab(host);
        else if (state.activeTab === 'timeline') renderTimelineTab(host);
        else if (state.activeTab === 'accuse') renderAccuseTab(host);
    }

    /* =========================================================================
       9. ABA 1: CENA DO CRIME ATIVA + MINI-ENIGMAS COM TECLADO
       ========================================================================= */
    function isHotspotCleared(c, prog, h) {
        const evOk = (h.unlocksEvidences || []).every(id => prog.collectedEvidences.includes(id));
        const puzOk = !h.puzzle || prog.solvedPuzzles.includes(h.puzzle.id);
        return evOk && puzOk;
    }

    function renderSceneTab(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const selectedSpot = c.hotspots.find(h => h.id === state.selectedHotspotId) || c.hotspots[0];
        const inspectedCount = c.hotspots.filter(h => prog.inspectedHotspots.includes(h.id) && isHotspotCleared(c, prog, h)).length;

        let tutorialBannerHTML = '';
        if (c.isTutorial) {
            const step1 = prog.inspectedHotspots.length >= 2;
            const step2 = prog.solvedPuzzles.length >= 1;
            const step3 = prog.crackedSuspects.length >= 1;
            const step4 = prog.solved;
            tutorialBannerHTML = `
                <div class="tutorial-banner">
                    <div class="mono-label-dark mono-label-brass">Guia Prático do Caso Tutorial (4 Passos)</div>
                    <div class="tutorial-steps">
                        <span class="tutorial-step ${step1 ? 'done' : ''}">${step1 ? icon('check', 13) : '1.'} Inspecione os 2 pontos da planta baixa</span>
                        <span class="tutorial-step ${step2 ? 'done' : ''}">${step2 ? icon('check', 13) : '2.'} Decifre o armário (1984)</span>
                        <span class="tutorial-step ${step3 ? 'done' : ''}">${step3 ? icon('check', 13) : '3.'} Confronte Vicente com E3</span>
                        <span class="tutorial-step ${step4 ? 'done' : ''}">${step4 ? icon('check', 13) : '4.'} Assine o mandado na Acusação</span>
                    </div>
                </div>
            `;
        }

        const spotSolvedPuzzle = selectedSpot.puzzle && prog.solvedPuzzles.includes(selectedSpot.puzzle.id);

        host.innerHTML = `
            <div class="section-title">
                <span>${escapeHTML(c.title)}</span>
                <span class="mono-label">${escapeHTML(c.code)} &bull; Cena: ${inspectedCount}/${c.hotspots.length} pontos concluídos</span>
            </div>
            ${tutorialBannerHTML}
            <div class="scene-grid">
                <div class="paper-sheet">
                    <div class="paper-clip" aria-hidden="true"></div>
                    <div class="dossier-meta-grid">
                        <div class="meta-box">
                            <span class="mono-label">Vítima</span>
                            <strong>${escapeHTML(c.victim)}</strong>
                        </div>
                        <div class="meta-box">
                            <span class="mono-label">Hora Estimada</span>
                            <strong>${escapeHTML(c.timeOfDeath)}</strong>
                        </div>
                        <div class="meta-box meta-box-full">
                            <span class="mono-label">Local do Crime</span>
                            <strong>${escapeHTML(c.location)}</strong>
                        </div>
                    </div>
                    <h3 class="mono-label">Resumo da Ocorrência</h3>
                    <p class="scene-summary-text">${escapeHTML(c.summary)}</p>
                    <div class="scene-tip-box">
                        <strong>Coleta Ativa:</strong> Selecione os marcadores numerados da planta baixa (por clique ou teclado) para recolher evidências e destravar cofres, celulares ou cifras antes dos interrogatórios.
                    </div>
                    ${prog.solved ? `
                        <div class="scene-solved-banner">
                            ${icon('check', 15)}
                            <span>CASO ENCERRADO — Melhor pontuação: <strong>${prog.bestScore} pts</strong> (${escapeHTML(prog.bestRank)})</span>
                        </div>` : ''}
                </div>

                <div class="floorplan-container">
                    <div class="floorplan-header">
                        <span>PLANTA BAIXA INTERATIVA</span>
                        <span>SELECIONE OS PONTOS PARA COLETAR</span>
                    </div>
                    <div id="floorplan-slot">${c.floorplanSvg}</div>
                    <div class="hotspot-quick-list">
                        ${c.hotspots.map((h, i) => {
                            const cleared = isHotspotCleared(c, prog, h);
                            const hasPendingPuzzle = h.puzzle && !prog.solvedPuzzles.includes(h.puzzle.id);
                            const statusIcon = hasPendingPuzzle ? icon('lock', 12) : cleared ? icon('check', 12) : icon('dot', 10);
                            return `
                                <button type="button" class="hotspot-pill ${h.id === selectedSpot.id ? 'active' : ''} ${cleared ? 'cleared' : ''}" data-hotspot-id="${escapeHTML(h.id)}">
                                    <span>${i + 1}. ${escapeHTML(h.label)}</span>
                                    ${statusIcon}
                                </button>
                            `;
                        }).join('')}
                    </div>
                    <div class="hotspot-info" id="hotspot-info" tabindex="-1" aria-live="polite">
                        <h4>
                            ${icon('pin', 14)}
                            <span>${escapeHTML(selectedSpot.label)}</span>
                        </h4>
                        <p>${escapeHTML(selectedSpot.detail)}</p>
                        ${selectedSpot.puzzle ? `
                            <div class="hotspot-puzzle-slot">
                                ${spotSolvedPuzzle
                                    ? `<span class="puzzle-solved-tag">${icon('check', 13)}<span>Enigma decifrado (${escapeHTML(selectedSpot.puzzle.title)})</span></span>`
                                    : `<button type="button" class="btn btn-gold btn-sm" id="btn-open-puzzle">${icon('lock', 13)}<span>Decifrar: ${escapeHTML(selectedSpot.puzzle.title)}</span></button>`
                                }
                            </div>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Inject accessible, keyboard-operable SVG hotspot markers
        const hotspotLayer = host.querySelector('#svg-hotspots');
        if (hotspotLayer) {
            hotspotLayer.innerHTML = c.hotspots.map((h, i) => {
                const isSelected = h.id === selectedSpot.id;
                const cleared = isHotspotCleared(c, prog, h);
                const hasPendingPuzzle = h.puzzle && !prog.solvedPuzzles.includes(h.puzzle.id);
                const isPending = !cleared || hasPendingPuzzle;
                const fillRing = isSelected ? 'rgba(201,158,50,0.45)' : cleared ? 'rgba(57,181,116,0.28)' : 'rgba(201,42,42,0.34)';
                const strokeRing = isSelected ? '#f2cc63' : hasPendingPuzzle ? '#e7c873' : cleared ? '#5ed493' : '#f28482';
                const fillCore = isSelected ? '#c99e32' : hasPendingPuzzle ? '#9c7114' : cleared ? '#185c39' : '#b82525';
                const statusText = hasPendingPuzzle ? 'enigma trancado' : cleared ? 'concluído' : 'pendente de coleta';
                return `
                    <g class="hotspot ${isPending ? 'hotspot-pending' : ''}" data-hotspot-id="${escapeHTML(h.id)}" transform="translate(${h.x}, ${h.y})" tabindex="0" role="button" aria-label="Ponto ${i + 1}: ${escapeHTML(h.label)} (${statusText})">
                        <circle class="pulse-ring" r="${isSelected ? 15 : 12.5}" fill="${fillRing}" stroke="${strokeRing}" stroke-width="2"/>
                        <circle r="8" fill="${fillCore}"/>
                        <text y="3.2" text-anchor="middle" fill="#fff" font-family="monospace" font-size="9" font-weight="bold">${i + 1}</text>
                    </g>
                `;
            }).join('');

            const selectSpot = (spotId, sourceEl, focusSelector) => {
                state.selectedHotspotId = spotId;
                const spot = c.hotspots.find(h => h.id === spotId);
                if (!spot) return;
                if (!prog.inspectedHotspots.includes(spotId)) {
                    prog.inspectedHotspots.push(spotId);
                }
                const newlyCollected = [];
                (spot.unlocksEvidences || []).forEach(evId => {
                    if (!prog.collectedEvidences.includes(evId)) {
                        prog.collectedEvidences.push(evId);
                        const evObj = c.evidences.find(e => e.id === evId);
                        if (evObj) {
                            newlyCollected.push(`${evObj.code} — ${evObj.title}`);
                            appendInterrogationLog(prog, {
                                suspectId: null,
                                suspectName: 'Cena do Crime',
                                kind: 'evidence',
                                evidenceId: evObj.id,
                                evidenceCode: evObj.code,
                                title: `${evObj.code} — ${evObj.title}`,
                                text: `Coletada em "${spot.label}". ${evObj.desc}`
                            });
                        }
                    }
                });
                savePersistedData();
                updateCounters();
                if (newlyCollected.length > 0) {
                    triggerFeedback('medium', sourceEl, { sound: 'breakthrough', particles: 'gold_spark' });
                    showToast(`Evidência coletada: ${newlyCollected.join(', ')}`);
                } else {
                    triggerFeedback('small', sourceEl, { sound: 'click' });
                }
                renderSceneTab(host);
                if (focusSelector) {
                    const restoreEl = host.querySelector(focusSelector);
                    if (restoreEl && typeof restoreEl.focus === 'function') restoreEl.focus();
                }
            };

            hotspotLayer.querySelectorAll('.hotspot').forEach(el => {
                el.addEventListener('click', () => selectSpot(el.dataset.hotspotId, el, null));
                el.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const sid = el.dataset.hotspotId;
                        selectSpot(sid, el, `.hotspot[data-hotspot-id="${CSS.escape(sid)}"]`);
                    }
                });
            });
            host.querySelectorAll('.hotspot-pill').forEach(el => {
                el.addEventListener('click', e => {
                    const sid = el.dataset.hotspotId;
                    const byKbd = e.detail === 0;
                    selectSpot(sid, el, byKbd ? `.hotspot-pill[data-hotspot-id="${CSS.escape(sid)}"]` : null);
                });
            });
        }

        const puzBtn = host.querySelector('#btn-open-puzzle');
        if (puzBtn && selectedSpot.puzzle) {
            puzBtn.addEventListener('click', () => openPuzzleModal(c, selectedSpot.puzzle));
        }
    }

    /* ----- MODAL DE MINI-ENIGMAS (Teclado + Backspace + Discos Dinâmicos) ----- */
    function detachPuzzleKeyHandler() {
        if (state.puzzleKeyHandler) {
            document.removeEventListener('keydown', state.puzzleKeyHandler);
            state.puzzleKeyHandler = null;
        }
    }

    function openPuzzleModal(caseObj, puzzle) {
        state.activePuzzle = { caseId: caseObj.id, puzzle };
        renderPuzzleModalBody();
        const body = document.getElementById('puzzle-modal-body');
        const primaryTarget = body && (
            body.querySelector('.keypad-btn[data-key="1"]') ||
            body.querySelector('#dial-val-0') ||
            body.querySelector('#cipher-minus') ||
            body.querySelector('#cipher-input')
        );
        pushOverlay(puzzleModal, {
            initialFocus: primaryTarget,
            returnFocusSelector: '#hotspot-info',
            onClose: () => {
                detachPuzzleKeyHandler();
                state.activePuzzle = null;
            }
        });
        triggerFeedback('small', null, { sound: 'lock' });
    }

    function renderPuzzleModalBody() {
        detachPuzzleKeyHandler();
        if (!state.activePuzzle) return;
        const { caseId, puzzle } = state.activePuzzle;
        const caseObj = getCaseById(caseId);
        const body = document.getElementById('puzzle-modal-body');

        if (puzzle.type === 'keypad' || puzzle.type === 'phone_pin') {
            const ansLen = String(puzzle.answer || '').length || 4;
            const placeholderSlots = '_'.repeat(ansLen).split('').join(' ');

            body.innerHTML = `
                <h3 class="puzzle-title">${escapeHTML(puzzle.title)}</h3>
                <p class="puzzle-prompt">${escapeHTML(puzzle.prompt)}</p>
                <div class="hint-card">
                    <strong>Pista de Campo:</strong> ${escapeHTML(puzzle.clueRef)}
                </div>
                <div class="puzzle-display" id="puzzle-input-display" data-val="" aria-live="polite">${placeholderSlots}</div>
                <div class="keypad-grid">
                    ${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'LIMPAR', '0', 'APAGAR'].map(key => {
                        const label = key === 'APAGAR' ? `${icon('backspace', 15)}<span class="sr-only">Apagar último dígito</span>` : key;
                        return `<button type="button" class="btn btn-paper keypad-btn" data-key="${key}">${label}</button>`;
                    }).join('')}
                </div>
                <div class="keypad-actions-row">
                    <button type="button" class="btn btn-gold" id="btn-submit-keypad">${icon('unlock', 14)}<span>Destravar</span></button>
                </div>
                <div class="puzzle-kbd-hint">Dica: você pode digitar 0–9, Backspace e Enter diretamente no teclado.</div>
                <div id="puzzle-feedback" class="puzzle-feedback" role="alert"></div>
            `;

            const display = body.querySelector('#puzzle-input-display');
            const updateDisplay = val => {
                display.dataset.val = val;
                display.classList.remove('reject', 'accept');
                display.textContent = val.padEnd(ansLen, '_').split('').join(' ');
            };

            const pressKey = k => {
                let cur = display.dataset.val || '';
                triggerFeedback('small', null, { sound: 'lock' });
                if (k === 'LIMPAR') {
                    cur = '';
                } else if (k === 'APAGAR') {
                    cur = cur.slice(0, -1);
                } else if (/^\d$/.test(k) && cur.length < ansLen) {
                    cur += k;
                }
                updateDisplay(cur);
            };

            const submitPin = () => verifyPuzzleAnswer(caseObj, puzzle, display.dataset.val || '', display);

            body.querySelectorAll('.keypad-btn').forEach(btn => {
                btn.addEventListener('click', () => pressKey(btn.dataset.key));
            });
            body.querySelector('#btn-submit-keypad').addEventListener('click', submitPin);

            state.puzzleKeyHandler = e => {
                if (!puzzleModal.classList.contains('open')) return;
                if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    pressKey(e.key);
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    pressKey('APAGAR');
                } else if (e.key === 'Delete') {
                    e.preventDefault();
                    pressKey('LIMPAR');
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    submitPin();
                }
            };
            document.addEventListener('keydown', state.puzzleKeyHandler);

        } else if (puzzle.type === 'dial_lock') {
            const dialCount = Math.max(2, String(puzzle.answer || '000').length);
            const digits = Array(dialCount).fill(0);
            let activeDial = 0;

            body.innerHTML = `
                <h3 class="puzzle-title">${escapeHTML(puzzle.title)}</h3>
                <p class="puzzle-prompt">${escapeHTML(puzzle.prompt)}</p>
                <div class="hint-card">
                    <strong>Pista de Campo:</strong> ${escapeHTML(puzzle.clueRef)}
                </div>
                <div class="dial-row" id="dial-row">
                    ${digits.map((_, idx) => `
                        <div class="dial-col ${idx === 0 ? 'active-dial' : ''}" data-dial-col="${idx}">
                            <button type="button" class="btn btn-paper btn-icon dial-step" data-idx="${idx}" data-delta="1" aria-label="Aumentar disco ${idx + 1}">${icon('chevron_up', 16)}</button>
                            <button type="button" class="dial-digit" id="dial-val-${idx}" data-idx="${idx}" aria-label="Disco ${idx + 1}, valor 0">0</button>
                            <button type="button" class="btn btn-paper btn-icon dial-step" data-idx="${idx}" data-delta="-1" aria-label="Diminuir disco ${idx + 1}">${icon('chevron_down', 16)}</button>
                        </div>
                    `).join('')}
                </div>
                <div class="dial-submit-row">
                    <button type="button" class="btn btn-gold" id="btn-submit-dial">${icon('unlock', 14)}<span>Destravar Cadeado (${dialCount} Discos)</span></button>
                </div>
                <div class="puzzle-kbd-hint">Teclado: setas &larr;/&rarr; escolhem o disco, &uarr;/&darr; ou 0–9 giram o dígito, Enter destrava.</div>
                <div id="puzzle-feedback" class="puzzle-feedback" role="alert"></div>
            `;

            const syncDials = () => {
                body.querySelectorAll('.dial-col').forEach(col => {
                    col.classList.toggle('active-dial', Number(col.dataset.dialCol) === activeDial);
                });
                digits.forEach((val, idx) => {
                    const el = body.querySelector(`#dial-val-${idx}`);
                    if (el) {
                        el.textContent = String(val);
                        el.setAttribute('aria-label', `Disco ${idx + 1}, valor ${val}`);
                    }
                });
            };

            body.querySelectorAll('.dial-step').forEach(btn => {
                btn.addEventListener('click', () => {
                    const i = Number(btn.dataset.idx);
                    const d = Number(btn.dataset.delta);
                    activeDial = i;
                    digits[i] = (digits[i] + d + 10) % 10;
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                });
            });

            body.querySelectorAll('.dial-digit').forEach(btn => {
                btn.addEventListener('click', () => {
                    activeDial = Number(btn.dataset.idx);
                    digits[activeDial] = (digits[activeDial] + 1) % 10;
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                });
            });

            const submitDial = () => verifyPuzzleAnswer(caseObj, puzzle, digits.join(''), body.querySelector('#dial-row'));
            body.querySelector('#btn-submit-dial').addEventListener('click', submitDial);

            state.puzzleKeyHandler = e => {
                if (!puzzleModal.classList.contains('open')) return;
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    activeDial = (activeDial + 1) % dialCount;
                    syncDials();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    activeDial = (activeDial - 1 + dialCount) % dialCount;
                    syncDials();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    digits[activeDial] = (digits[activeDial] + 1) % 10;
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    digits[activeDial] = (digits[activeDial] + 9) % 10;
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    if (digits[activeDial] !== 0) {
                        digits[activeDial] = 0;
                    } else if (activeDial > 0) {
                        activeDial -= 1;
                        digits[activeDial] = 0;
                    }
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                } else if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    digits[activeDial] = Number(e.key);
                    activeDial = Math.min(dialCount - 1, activeDial + 1);
                    syncDials();
                    triggerFeedback('small', null, { sound: 'lock' });
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    submitDial();
                }
            };
            document.addEventListener('keydown', state.puzzleKeyHandler);

        } else if (puzzle.type === 'cipher') {
            let shift = 0;
            const shiftWord = (word, s) => String(word || '').toUpperCase().replace(/[A-Z]/g, ch => {
                const code = ch.charCodeAt(0) - 65;
                return String.fromCharCode(((code + s + 260) % 26) + 65);
            });

            body.innerHTML = `
                <h3 class="puzzle-title">${escapeHTML(puzzle.title)}</h3>
                <p class="puzzle-prompt">${escapeHTML(puzzle.prompt)}</p>
                <div class="hint-card">
                    <strong>Pista:</strong> ${escapeHTML(puzzle.clueRef)}
                </div>
                <div class="cipher-box">
                    <div class="mono-label">Texto Cifrado: <strong>${escapeHTML(puzzle.cipherText)}</strong></div>
                    <div class="cipher-preview" id="cipher-preview">${escapeHTML(puzzle.cipherText)}</div>
                    <div class="cipher-controls">
                        <button type="button" class="btn btn-paper btn-sm" id="cipher-minus">${icon('arrow_left', 13)}<span>-1 Letra</span></button>
                        <span class="mono-label tabular" id="cipher-shift-label">Deslocamento: 0</span>
                        <button type="button" class="btn btn-paper btn-sm" id="cipher-plus"><span>+1 Letra</span>${icon('arrow_right', 13)}</button>
                    </div>
                </div>
                <div class="cipher-submit-row">
                    <input type="text" id="cipher-input" class="dossier-select" aria-label="Palavra decifrada" placeholder="Palavra decifrada..." autocomplete="off" />
                    <button type="button" class="btn btn-gold" id="btn-submit-cipher">${icon('unlock', 14)}<span>Confirmar</span></button>
                </div>
                <div class="puzzle-kbd-hint">Teclado: setas &larr;/&rarr; giram a cifra César, Enter confirma a palavra.</div>
                <div id="puzzle-feedback" class="puzzle-feedback" role="alert"></div>
            `;

            const inputEl = body.querySelector('#cipher-input');
            const previewEl = body.querySelector('#cipher-preview');
            const updatePreview = () => {
                const decoded = shiftWord(puzzle.cipherText || '', shift);
                previewEl.textContent = decoded;
                body.querySelector('#cipher-shift-label').textContent = `Deslocamento: ${shift > 0 ? '+' + shift : shift}`;
                inputEl.value = decoded;
                triggerFeedback('small', null, { sound: 'lock' });
            };

            body.querySelector('#cipher-minus').addEventListener('click', () => { shift--; updatePreview(); });
            body.querySelector('#cipher-plus').addEventListener('click', () => { shift++; updatePreview(); });
            const submitCipher = () => verifyPuzzleAnswer(caseObj, puzzle, inputEl.value, previewEl);
            body.querySelector('#btn-submit-cipher').addEventListener('click', submitCipher);

            state.puzzleKeyHandler = e => {
                if (!puzzleModal.classList.contains('open')) return;
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitCipher();
                } else if (document.activeElement !== inputEl && e.key === 'ArrowLeft') {
                    e.preventDefault();
                    shift--;
                    updatePreview();
                } else if (document.activeElement !== inputEl && e.key === 'ArrowRight') {
                    e.preventDefault();
                    shift++;
                    updatePreview();
                }
            };
            document.addEventListener('keydown', state.puzzleKeyHandler);
        }
    }

    function verifyPuzzleAnswer(caseObj, puzzle, rawAttempt, visorEl) {
        const clean = String(rawAttempt || '').trim().toUpperCase();
        const fb = document.getElementById('puzzle-feedback');
        if (clean === String(puzzle.answer).toUpperCase()) {
            const prog = ensureCaseProgress(caseObj.id);
            if (!prog.solvedPuzzles.includes(puzzle.id)) {
                prog.solvedPuzzles.push(puzzle.id);
                persisted.profile.puzzlesSolvedCount = (persisted.profile.puzzlesSolvedCount || 0) + 1;
            }
            const unlockedNames = [];
            (puzzle.unlocksEvidences || []).forEach(evId => {
                if (!prog.collectedEvidences.includes(evId)) {
                    prog.collectedEvidences.push(evId);
                    const ev = caseObj.evidences.find(x => x.id === evId);
                    if (ev) {
                        unlockedNames.push(`${ev.code} — ${ev.title}`);
                        appendInterrogationLog(prog, {
                            suspectId: null,
                            suspectName: 'Perícia / Enigma',
                            kind: 'evidence',
                            evidenceId: ev.id,
                            evidenceCode: ev.code,
                            title: `${ev.code} — ${ev.title}`,
                            text: `Destravada em "${puzzle.title}". ${ev.desc}`
                        });
                    }
                }
            });
            savePersistedData();
            if (visorEl && visorEl.classList) visorEl.classList.add('accept');
            triggerFeedback('medium', visorEl, { sound: 'unlock', particles: 'gold_spark' });
            evaluateAchievements(caseObj, null);
            updateCounters();
            renderActiveTab();
            popOverlay(false);
            showToast(`Trava aberta! Evidência liberada: ${unlockedNames.join(', ')}`);
        } else {
            AudioFX.playError();
            if (visorEl && visorEl.classList) {
                visorEl.classList.remove('reject');
                void visorEl.offsetWidth;
                visorEl.classList.add('reject');
            }
            if (fb) {
                fb.textContent = 'Código incorreto. Revise a pista de campo nos documentos coletados e tente novamente.';
            }
        }
    }

    /* =========================================================================
       10. ABA 2: SUSPEITOS, TYPEWRITER ZERO-JUMP & BACKLOG DO INQUÉRITO
       ========================================================================= */
    function getSuspectMood(prog, suspect) {
        if (state.suspectMoods[suspect.id]) return state.suspectMoods[suspect.id];
        if (prog.crackedSuspects.includes(suspect.id)) return 'sweating';
        return 'calm';
    }

    function getMoodLabel(mood) {
        if (mood === 'nervous') return { text: 'NERVOSO', cls: 'mood-nervous' };
        if (mood === 'sweating') return { text: 'SUANDO FRIO', cls: 'mood-sweating' };
        if (mood === 'furious') return { text: 'FURIOSO', cls: 'mood-furious' };
        return { text: 'CALMO', cls: 'mood-calm' };
    }

    function cancelTypewriter() {
        if (state.typewriterRafId) {
            cancelAnimationFrame(state.typewriterRafId);
            state.typewriterRafId = null;
        }
        if (state.typewriterSkipFn) {
            document.removeEventListener('keydown', state.typewriterSkipFn, true);
            state.typewriterSkipFn = null;
        }
        state.typewriterTriggerEl = null;
    }

    // Visual-Novel Pattern 1: Pre-measured full text in inline spans (zero word/line jumping)
    function runTypewriter(el, plainText) {
        cancelTypewriter();
        const text = String(plainText || '');
        const speedPref = persisted.profile.textSpeed || 'normal';
        const skipHint = document.getElementById('answer-skip-hint');
        if (prefersReducedMotion() || speedPref === 'instant' || text.length === 0) {
            el.textContent = text;
            if (skipHint) skipHint.textContent = '';
            return;
        }

        const cps = speedPref === 'fast' ? 128 : 56;
        el.innerHTML = `<span class="tw-vis"></span><span class="tw-caret" aria-hidden="true"></span><span class="tw-hid" aria-hidden="true">${escapeHTML(text)}</span>`;
        const visEl = el.querySelector('.tw-vis');
        const caretEl = el.querySelector('.tw-caret');
        const hidEl = el.querySelector('.tw-hid');

        let shown = 0;
        let lastClickChar = 0;
        let lastTs = performance.now();

        const finishNow = () => {
            cancelTypewriter();
            el.textContent = text;
            el.removeEventListener('click', onClickSkip);
            if (skipHint) skipHint.textContent = '';
        };

        const onClickSkip = () => finishNow();
        const onKeySkip = e => {
            if (getTopOverlay() || isEditableTarget(document.activeElement)) return;
            if (e.key === ' ' || e.key === 'Enter') {
                const active = document.activeElement;
                // Allow Space/Enter to skip unless focus explicitly moved to a different interactive control
                const isDifferentControl = active &&
                    (active.tagName === 'BUTTON' || active.tagName === 'A' || active.tagName === 'SUMMARY') &&
                    active !== el &&
                    active !== state.typewriterTriggerEl;
                if (isDifferentControl) return;
                e.preventDefault();
                e.stopPropagation();
                if (!e.repeat) finishNow();
            }
        };

        el.addEventListener('click', onClickSkip);
        state.typewriterSkipFn = onKeySkip;
        document.addEventListener('keydown', onKeySkip, true);

        function tick(now) {
            const dt = Math.min(0.08, Math.max(0, (now - lastTs) / 1000));
            lastTs = now;
            shown += cps * dt;
            const count = Math.min(text.length, Math.floor(shown));
            if (count >= text.length) {
                finishNow();
                return;
            }
            if (visEl && hidEl) {
                visEl.textContent = text.slice(0, count);
                hidEl.textContent = text.slice(count);
            }
            if (count - lastClickChar >= 5) {
                lastClickChar = count;
                AudioFX.playTypeClick();
            }
            state.typewriterRafId = requestAnimationFrame(tick);
        }

        if (caretEl) {
            state.typewriterRafId = requestAnimationFrame(tick);
        }
    }

    function appendInterrogationLog(prog, entry) {
        if (!Array.isArray(prog.interrogationLog)) prog.interrogationLog = [];
        // Avoid duplicating identical entries
        const dup = prog.interrogationLog.some(item => {
            if (entry.kind === 'evidence' && item.kind === 'evidence' && entry.evidenceId && item.evidenceId === entry.evidenceId) {
                return true;
            }
            return item.suspectId === entry.suspectId && item.kind === entry.kind && item.title === entry.title;
        });
        if (!dup) {
            prog.interrogationLog.unshift({
                ...entry,
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });
            if (prog.interrogationLog.length > 80) prog.interrogationLog.length = 80;
        }
    }

    function buildBacklogItems(c, prog) {
        const rawList = Array.isArray(prog.interrogationLog) ? prog.interrogationLog : [];
        // Non-destructively enrich legacy confrontation/breakthrough entries with unlocked evidence labels
        const list = rawList.map(item => {
            if ((item.kind === 'breakthrough' || item.kind === 'confrontation') && !item.unlockedEvidenceLabel && item.suspectId) {
                const s = (c.suspects || []).find(x => x.id === item.suspectId);
                const cf = s && (s.confrontations || []).find(x => x.response === item.text && x.unlocksEvidenceId);
                const ev = cf && (c.evidences || []).find(e => e.id === cf.unlocksEvidenceId);
                if (ev && (prog.unlockedEvidences || []).includes(ev.id)) {
                    return {
                        ...item,
                        unlockedEvidenceId: ev.id,
                        unlockedEvidenceLabel: `${ev.code} — ${ev.title}`
                    };
                }
            }
            return item;
        });

        // Backfill older saves that had askedQuestions not present in interrogationLog
        (c.suspects || []).forEach(s => {
            const asked = prog.askedQuestions[s.id] || [];
            asked.forEach(qid => {
                const qObj = (s.questions || []).find(q => q.id === qid);
                if (!qObj) return;
                const already = list.some(item => item.kind === 'question' && item.suspectId === s.id && item.title === qObj.q);
                if (!already) {
                    list.push({
                        suspectId: s.id,
                        suspectName: s.name,
                        kind: 'question',
                        title: qObj.q,
                        text: `"${qObj.a}"`,
                        time: ''
                    });
                }
            });
        });

        // Backfill collected and unlocked evidences from older saves not yet present in interrogationLog
        const recordedEvIds = new Set(
            list.filter(item => item.kind === 'evidence' && item.evidenceId).map(item => item.evidenceId)
        );
        const addBackfillEvidence = (evId, isSecret) => {
            if (recordedEvIds.has(evId)) return;
            const ev = (c.evidences || []).find(x => x.id === evId);
            if (!ev) return;
            recordedEvIds.add(evId);
            if (isSecret) {
                const srcSuspect = (c.suspects || []).find(s =>
                    (s.confrontations || []).some(cf => cf.unlocksEvidenceId === evId)
                );
                list.push({
                    suspectId: srcSuspect ? srcSuspect.id : null,
                    suspectName: srcSuspect ? `Prova Secreta (${srcSuspect.name})` : 'Prova Desbloqueada',
                    kind: 'evidence',
                    evidenceId: ev.id,
                    evidenceCode: ev.code,
                    title: `${ev.code} — ${ev.title}`,
                    text: srcSuspect ? `Desbloqueada no confronto com ${srcSuspect.name}. ${ev.desc}` : ev.desc,
                    time: ''
                });
            } else {
                const spot = (c.hotspots || []).find(h =>
                    (h.unlocksEvidences || []).includes(evId) ||
                    (h.puzzle && (h.puzzle.unlocksEvidences || []).includes(evId))
                );
                const viaPuzzle = Boolean(spot && spot.puzzle && (spot.puzzle.unlocksEvidences || []).includes(evId));
                list.push({
                    suspectId: null,
                    suspectName: viaPuzzle ? 'Perícia / Enigma' : 'Cena do Crime',
                    kind: 'evidence',
                    evidenceId: ev.id,
                    evidenceCode: ev.code,
                    title: `${ev.code} — ${ev.title}`,
                    text: viaPuzzle
                        ? `Destravada em "${spot.puzzle.title}". ${ev.desc}`
                        : spot
                            ? `Coletada em "${spot.label}". ${ev.desc}`
                            : ev.desc,
                    time: ''
                });
            }
        };

        (prog.unlockedEvidences || []).forEach(evId => addBackfillEvidence(evId, true));
        (prog.collectedEvidences || []).forEach(evId => addBackfillEvidence(evId, false));

        return list;
    }

    function renderSuspectsTab(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const suspect = c.suspects.find(s => s.id === state.selectedSuspectId) || c.suspects[0];
        const visibleEvidences = getVisibleEvidences(c);
        const askedSet = prog.askedQuestions[suspect.id] || [];
        const mood = getSuspectMood(prog, suspect);
        const moodInfo = getMoodLabel(mood);
        const isLockedOut = prog.authority <= 0;
        const doRecoil = state.recoilSuspectId === suspect.id;
        state.recoilSuspectId = null;

        const allLog = buildBacklogItems(c, prog);
        const suspectLogCount = allLog.filter(item => item.suspectId === suspect.id).length;
        const evidenceLogCount = allLog.filter(item => item.kind === 'evidence').length;
        const filteredLog = state.backlogFilter === 'suspect'
            ? allLog.filter(item => item.suspectId === suspect.id)
            : state.backlogFilter === 'evidence'
                ? allLog.filter(item => item.kind === 'evidence')
                : allLog;

        host.innerHTML = `
            <div class="section-title">
                <span>Sala de Interrogatório</span>
                <span class="mono-label">Cruze depoimentos com provas físicas</span>
            </div>
            <div class="suspects-layout">
                <div class="suspect-list" role="group" aria-label="Lista de Suspeitos">
                    ${c.suspects.map(s => {
                        const cracked = prog.crackedSuspects.includes(s.id);
                        const sMood = getSuspectMood(prog, s);
                        return `
                            <button type="button" class="suspect-card-mini ${s.id === suspect.id ? 'active' : ''}" data-suspect-id="${escapeHTML(s.id)}" aria-pressed="${s.id === suspect.id ? 'true' : 'false'}">
                                <div class="portrait-thumb">${Art.getPortraitSVG(s.portrait, sMood)}</div>
                                <div class="suspect-mini-body">
                                    <div class="suspect-mini-name">${escapeHTML(s.name)}</div>
                                    <div class="suspect-mini-role">${escapeHTML(s.role)}</div>
                                    ${cracked ? `<span class="cracked-badge">Mentira Exposta</span>` : ''}
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>

                <div class="paper-sheet">
                    <div class="interrogation-header">
                        <div class="portrait-large ${doRecoil ? 'portrait-recoil' : ''}">${Art.getPortraitSVG(suspect.portrait, mood)}</div>
                        <div class="suspect-profile-col">
                            <div class="suspect-head-tags">
                                <h3 class="suspect-full-name">${escapeHTML(suspect.name)} (${suspect.age} anos)</h3>
                                <span class="mood-pill ${moodInfo.cls}">${moodInfo.text}</span>
                            </div>
                            <div class="suspect-meta-line"><strong>Vínculo:</strong> ${escapeHTML(suspect.role)}</div>
                            <div class="suspect-profile-line"><strong>Perfil:</strong> ${escapeHTML(suspect.profile)}</div>
                            <div class="suspect-head-actions">
                                <button type="button" class="btn btn-paper btn-sm" id="btn-pin-suspect-compare">${icon('compare', 13)}<span>Fixar no Comparador</span></button>
                            </div>
                        </div>
                    </div>

                    <div class="block-heading">Depoimento Inicial</div>
                    <div class="quote-box">"${escapeHTML(suspect.statement)}"</div>

                    <div class="alibi-tag">
                        <strong>Álibi Declarado:</strong> ${escapeHTML(suspect.alibi)}
                    </div>

                    <div class="questions-box">
                        <div class="block-heading">Perguntas de Interrogatório</div>
                        ${suspect.questions.map(qObj => {
                            const isAsked = askedSet.includes(qObj.id);
                            return `<button type="button" class="question-btn ${isAsked ? 'asked' : ''}" data-qid="${escapeHTML(qObj.id)}">
                                <span class="question-btn-icon">${isAsked ? icon('check', 14) : icon('chevron_right', 14)}</span>
                                <span>${escapeHTML(qObj.q)}</span>
                            </button>`;
                        }).join('')}
                    </div>

                    <div class="confront-box">
                        <div class="block-heading block-heading-danger">Confrontar Contradição com Evidência</div>
                        <p class="helper-text">
                            Provas irrelevantes descontam <strong>-20% de Autoridade</strong>. Use o Comparador ou o Mural para confirmar contradições antes.
                        </p>
                        <div class="confront-controls">
                            <select class="dossier-select" id="confront-select" aria-label="Selecionar evidência para confronto" ${isLockedOut ? 'disabled' : ''}>
                                <option value="">— Selecione uma evidência coletada —</option>
                                ${visibleEvidences.map(ev => `<option value="${escapeHTML(ev.id)}">${escapeHTML(ev.code)} — ${escapeHTML(ev.title)}</option>`).join('')}
                            </select>
                            <button type="button" class="btn btn-danger" id="btn-confront" ${isLockedOut ? 'disabled' : ''}>Apresentar Prova</button>
                        </div>
                    </div>

                    ${state.interrogationFeedback ? `
                        <div class="answer-log ${state.interrogationFeedback.breakthrough ? 'breakthrough' : ''}" aria-live="polite">
                            <div class="answer-log-head">
                                <span>${escapeHTML(state.interrogationFeedback.title)}</span>
                                <span class="answer-skip-hint" id="answer-skip-hint">${state.interrogationFeedback.animateTypewriter ? 'Clique ou pressione Espaço para concluir' : ''}</span>
                            </div>
                            <div id="feedback-typewriter" class="tw-wrap">${escapeHTML(state.interrogationFeedback.text)}</div>
                            ${state.interrogationFeedback.unlockedMsg ? state.interrogationFeedback.unlockedMsg : ''}
                        </div>
                    ` : ''}

                    <div class="backlog-section">
                        <details class="backlog-details" id="backlog-details" ${state.backlogOpen ? 'open' : ''}>
                            <summary class="backlog-summary">
                                <span class="backlog-summary-left">
                                    ${icon('history', 14)}
                                    <span>Registro do Inquérito / Backlog (${allLog.length})</span>
                                </span>
                                <span class="mono-label" id="backlog-summary-state">${state.backlogOpen ? 'Recolher' : 'Revisar Histórico'}</span>
                            </summary>
                            <div class="suspect-head-actions">
                                <button type="button" class="btn btn-sm ${state.backlogFilter === 'all' ? 'btn-gold' : 'btn-paper'}" id="btn-backlog-all" aria-pressed="${state.backlogFilter === 'all'}">Todos do Caso (${allLog.length})</button>
                                <button type="button" class="btn btn-sm ${state.backlogFilter === 'suspect' ? 'btn-gold' : 'btn-paper'}" id="btn-backlog-suspect" aria-pressed="${state.backlogFilter === 'suspect'}">Apenas ${escapeHTML(suspect.name.split(' ')[0])} (${suspectLogCount})</button>
                                <button type="button" class="btn btn-sm ${state.backlogFilter === 'evidence' ? 'btn-gold' : 'btn-paper'}" id="btn-backlog-evidence" aria-pressed="${state.backlogFilter === 'evidence'}">Provas (${evidenceLogCount})</button>
                            </div>
                            ${filteredLog.length === 0
                                ? `<p class="helper-text helper-mt">${state.backlogFilter === 'evidence'
                                    ? 'Nenhuma evidência coletada ou desbloqueada ainda neste caso.'
                                    : 'Nenhuma pergunta, confronto ou evidência registrada ainda neste filtro.'}</p>`
                                : `<div class="backlog-list">
                                    ${filteredLog.map(item => `
                                        <div class="backlog-item ${item.kind === 'breakthrough' ? 'is-breakthrough' : item.kind === 'evidence' ? 'is-evidence' : ''}">
                                            <div class="backlog-item-head">
                                                <span><strong>${escapeHTML(item.suspectName)}</strong> &bull; ${escapeHTML(item.title)}</span>
                                                <span>${escapeHTML(item.time || '')}</span>
                                            </div>
                                            <div>${escapeHTML(item.text)}</div>
                                            ${item.unlockedEvidenceLabel ? `<div class="backlog-unlock-tag">${icon('star', 12)}<span>Evidência Desbloqueada: ${escapeHTML(item.unlockedEvidenceLabel)}</span></div>` : ''}
                                        </div>
                                    `).join('')}
                                   </div>`
                            }
                        </details>
                    </div>
                </div>
            </div>
        `;

        if (state.interrogationFeedback && state.interrogationFeedback.animateTypewriter) {
            const twEl = host.querySelector('#feedback-typewriter');
            if (twEl) runTypewriter(twEl, state.interrogationFeedback.text);
            state.interrogationFeedback.animateTypewriter = false;
        }

        host.querySelector('#btn-pin-suspect-compare').addEventListener('click', () => {
            openComparator(`suspect:${suspect.id}`, state.comparator.right);
        });

        host.querySelectorAll('.suspect-card-mini').forEach(btn => {
            btn.addEventListener('click', e => {
                cancelTypewriter();
                triggerFeedback('small', null, { sound: 'paper' });
                const sid = btn.dataset.suspectId;
                const byKbd = e.detail === 0;
                state.selectedSuspectId = sid;
                state.interrogationFeedback = null;
                renderSuspectsTab(host);
                if (byKbd) {
                    const nextEl = host.querySelector(`.suspect-card-mini[data-suspect-id="${CSS.escape(sid)}"]`);
                    if (nextEl) nextEl.focus();
                }
            });
        });

        host.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                triggerFeedback('small', null, { sound: 'click' });
                const qid = btn.dataset.qid;
                const byKbd = e.detail === 0;
                const qObj = suspect.questions.find(item => item.id === qid);
                if (!qObj) return;
                if (!prog.askedQuestions[suspect.id]) prog.askedQuestions[suspect.id] = [];
                if (!prog.askedQuestions[suspect.id].includes(qObj.id)) {
                    prog.askedQuestions[suspect.id].push(qObj.id);
                }
                appendInterrogationLog(prog, {
                    suspectId: suspect.id,
                    suspectName: suspect.name,
                    kind: 'question',
                    title: qObj.q,
                    text: `"${qObj.a}"`
                });
                savePersistedData();
                state.suspectMoods[suspect.id] = qObj.mood || 'calm';
                state.interrogationFeedback = {
                    title: `Resposta de ${suspect.name}`,
                    text: `"${qObj.a}"`,
                    breakthrough: false,
                    animateTypewriter: true
                };
                renderSuspectsTab(host);
                if (byKbd) {
                    const nextQ = host.querySelector(`.question-btn[data-qid="${CSS.escape(qid)}"]`);
                    if (nextQ) {
                        nextQ.focus();
                        if (state.typewriterRafId) state.typewriterTriggerEl = nextQ;
                    }
                }
            });
        });

        host.querySelector('#btn-confront').addEventListener('click', e => {
            if (prog.authority <= 0) {
                openAuthorityLockoutModal(c);
                return;
            }
            const byKbd = e.detail === 0;
            const evId = host.querySelector('#confront-select').value;
            if (!evId) {
                showToast('Selecione uma evidência coletada antes de apresentar o confronto.');
                return;
            }
            if (!prog.confrontedSuspects.includes(suspect.id)) {
                prog.confrontedSuspects.push(suspect.id);
            }
            const evObj = c.evidences.find(x => x.id === evId);
            const match = (suspect.confrontations || []).find(cf => cf.evidenceId === evId);
            if (match) {
                let unlockedMsg = '';
                let unlockedEvObj = null;
                if (match.marksContradiction && !prog.crackedSuspects.includes(suspect.id)) {
                    prog.crackedSuspects.push(suspect.id);
                }
                if (match.unlocksEvidenceId) {
                    const newEv = c.evidences.find(x => x.id === match.unlocksEvidenceId);
                    if (newEv) unlockedEvObj = newEv;
                    if (!prog.unlockedEvidences.includes(match.unlocksEvidenceId)) {
                        prog.unlockedEvidences.push(match.unlocksEvidenceId);
                        if (newEv) {
                            unlockedMsg = `<div class="unlocked-clue-banner">${icon('star', 14)}<span>NOVA EVIDÊNCIA DESBLOQUEADA: ${escapeHTML(newEv.code)} — ${escapeHTML(newEv.title)}</span></div>`;
                            showToast(`Nova pista desbloqueada: ${newEv.code} — ${newEv.title}`);
                            appendInterrogationLog(prog, {
                                suspectId: suspect.id,
                                suspectName: `Prova Secreta (${suspect.name})`,
                                kind: 'evidence',
                                evidenceId: newEv.id,
                                evidenceCode: newEv.code,
                                title: `${newEv.code} — ${newEv.title}`,
                                text: `Desbloqueada no confronto com ${evObj ? evObj.code : evId}. ${newEv.desc}`
                            });
                        }
                    }
                }
                if (!unlockedMsg && match.marksContradiction) {
                    showToast(`Contradição exposta no depoimento de ${suspect.name}!`);
                }
                appendInterrogationLog(prog, {
                    suspectId: suspect.id,
                    suspectName: suspect.name,
                    kind: match.marksContradiction ? 'breakthrough' : 'confrontation',
                    title: `Confronto com ${evObj ? evObj.code : evId}${match.marksContradiction ? ' (Contradição Exposta)' : ''}`,
                    text: match.response,
                    unlockedEvidenceId: unlockedEvObj ? unlockedEvObj.id : null,
                    unlockedEvidenceLabel: unlockedEvObj ? `${unlockedEvObj.code} — ${unlockedEvObj.title}` : null
                });
                state.suspectMoods[suspect.id] = match.mood || (match.marksContradiction ? 'sweating' : 'nervous');
                state.recoilSuspectId = match.marksContradiction ? suspect.id : null;
                savePersistedData();
                updateCounters();
                if (match.marksContradiction) {
                    triggerFeedback('large', e.currentTarget, { sound: 'breakthrough', trauma: 0.58, vignette: 'gold', particles: 'breakthrough' });
                } else {
                    triggerFeedback('medium', e.currentTarget, { sound: 'breakthrough', particles: 'gold_spark' });
                }
                state.interrogationFeedback = {
                    title: match.marksContradiction ? 'CONTRADIÇÃO EXPOSTA!' : 'REAÇÃO RELEVANTE',
                    text: match.response,
                    unlockedMsg,
                    breakthrough: true,
                    animateTypewriter: true
                };
            } else {
                const pairKey = `${suspect.id}:${evId}`;
                if (!prog.wrongConfronts.includes(pairKey)) {
                    prog.wrongConfronts.push(pairKey);
                    applyAuthorityPenalty(c, 20, 'Confronto improcedente');
                    renderAuthorityBar();
                } else {
                    AudioFX.playError();
                    showToast('Você já apresentou essa prova sem efeito contra este suspeito.');
                }
                state.suspectMoods[suspect.id] = suspect.wrongMood || 'furious';
                state.interrogationFeedback = {
                    title: `Reação de ${suspect.name}`,
                    text: suspect.wrongConfront,
                    breakthrough: false,
                    animateTypewriter: !getTopOverlay()
                };
            }
            renderSuspectsTab(host);
            if (byKbd && !getTopOverlay()) {
                const nextConfrontBtn = host.querySelector('#btn-confront');
                if (nextConfrontBtn && !nextConfrontBtn.disabled) {
                    nextConfrontBtn.focus();
                    if (state.typewriterRafId) state.typewriterTriggerEl = nextConfrontBtn;
                } else {
                    const nextSel = host.querySelector('#confront-select');
                    if (nextSel && !nextSel.disabled) nextSel.focus();
                }
            }
        });

        const backlogDetails = host.querySelector('#backlog-details');
        if (backlogDetails) {
            backlogDetails.addEventListener('toggle', () => {
                state.backlogOpen = backlogDetails.open;
                const stEl = host.querySelector('#backlog-summary-state');
                if (stEl) stEl.textContent = backlogDetails.open ? 'Recolher' : 'Revisar Histórico';
            });
        }
        const bindBacklogFilter = (selector, filterVal) => {
            const btn = host.querySelector(selector);
            if (!btn) return;
            btn.addEventListener('click', e => {
                const byKbd = e.detail === 0;
                state.backlogFilter = filterVal;
                state.backlogOpen = true;
                renderSuspectsTab(host);
                if (byKbd) {
                    const nextBtn = host.querySelector(selector);
                    if (nextBtn) nextBtn.focus();
                }
            });
        };
        bindBacklogFilter('#btn-backlog-all', 'all');
        bindBacklogFilter('#btn-backlog-suspect', 'suspect');
        bindBacklogFilter('#btn-backlog-evidence', 'evidence');
    }

    /* =========================================================================
       11. ABA 3: EVIDÊNCIAS + COMPARADOR LADO A LADO
       ========================================================================= */
    function renderEvidenceTab(host) {
        const c = getCaseById(state.currentCaseId);
        const visible = getVisibleEvidences(c);
        const hidden = c.evidences.filter(ev => !visible.some(v => v.id === ev.id));

        host.innerHTML = `
            <div class="section-title">
                <span>Quadro de Evidências (${visible.length}/${c.evidences.length})</span>
                <span class="mono-label">${hidden.length > 0 ? `${hidden.length} prova(s) lacrada(s) ou oculta(s)` : 'Todas as provas coletadas'}</span>
            </div>
            <div class="evidence-grid">
                ${visible.map(ev => `
                    <article class="evidence-card ${ev.secret ? 'secret-unlocked' : ''}">
                        <div class="evidence-top">
                            <div class="evidence-icon">${Art.getEvidenceIconSVG(ev.type)}</div>
                            <div>
                                <div class="evidence-code">${escapeHTML(ev.code)} ${ev.secret ? '&bull; DESBLOQUEADA' : ev.initial ? '&bull; INICIAL' : '&bull; COLETADA'}</div>
                                <div class="evidence-title">${escapeHTML(ev.title)}</div>
                            </div>
                        </div>
                        <p class="evidence-desc">${escapeHTML(ev.desc)}</p>
                        <div class="evidence-doc">${escapeHTML(ev.doc)}</div>
                        <div class="evidence-card-foot">
                            <button type="button" class="btn btn-paper btn-sm btn-compare-ev" data-ev-id="${escapeHTML(ev.id)}">${icon('compare', 13)}<span>Comparar Lado a Lado</span></button>
                        </div>
                    </article>
                `).join('')}

                ${hidden.map(ev => `
                    <article class="evidence-card locked-card">
                        <div class="evidence-top">
                            <div class="evidence-icon">${icon('lock', 18)}</div>
                            <div>
                                <div class="evidence-code">${escapeHTML(ev.code)} &bull; LACRADA</div>
                                <div class="evidence-title">Evidência Ainda Não Coletada</div>
                            </div>
                        </div>
                        <p class="evidence-desc">${escapeHTML(getEvidenceLockReason(c, ev))}</p>
                    </article>
                `).join('')}
            </div>
        `;

        host.querySelectorAll('.btn-compare-ev').forEach(btn => {
            btn.addEventListener('click', () => {
                openComparator(state.comparator.left, `evidence:${btn.dataset.evId}`);
            });
        });
    }

    /* =========================================================================
       12. ABA 4: MURAL DE FIOS VERMELHOS v2 (Rubber-band, Undo/Redo, Zoom/Fit, WCAG 2.5.7)
       ========================================================================= */
    function buildCorkNodes(c, prog) {
        const nodes = [];
        c.suspects.forEach((s, idx) => {
            nodes.push({
                id: `suspect:${s.id}`,
                kind: 'suspect',
                title: s.name,
                subtitle: s.role,
                portrait: s.portrait,
                mood: getSuspectMood(prog, s),
                defaultX: 24 + (idx % 3) * 224,
                defaultY: 32 + Math.floor(idx / 3) * 124
            });
        });
        const visibleEvs = getVisibleEvidences(c);
        visibleEvs.forEach((ev, idx) => {
            nodes.push({
                id: `evidence:${ev.id}`,
                kind: 'evidence',
                title: `${ev.code} — ${ev.title}`,
                subtitle: ev.desc.slice(0, 52) + (ev.desc.length > 52 ? '...' : ''),
                defaultX: 24 + (idx % 4) * 230,
                defaultY: 286 + Math.floor(idx / 4) * 128
            });
        });
        nodes.push({
            id: 'window:crime',
            kind: 'window',
            title: 'JANELA CRÍTICA',
            subtitle: c.crimeWindowLabel,
            defaultX: 730,
            defaultY: 32
        });
        return nodes;
    }

    function matchesKeyConnection(keyConn, link) {
        if (!keyConn || !link) return false;
        const pairMatch =
            (keyConn.from === link.from && keyConn.to === link.to) ||
            (keyConn.from === link.to && keyConn.to === link.from);
        if (!pairMatch) return false;
        if (!keyConn.relation) return true;
        return keyConn.relation === link.relation;
    }

    function getCorkUndoStacks(caseId) {
        if (!state.corkboard.undoByCase[caseId]) state.corkboard.undoByCase[caseId] = [];
        if (!state.corkboard.redoByCase[caseId]) state.corkboard.redoByCase[caseId] = [];
        return {
            undo: state.corkboard.undoByCase[caseId],
            redo: state.corkboard.redoByCase[caseId]
        };
    }

    function snapshotCorkboard(prog) {
        return JSON.stringify({
            nodes: prog.corkboard.nodes,
            links: prog.corkboard.links,
            confirmedKeys: prog.corkboard.confirmedKeys
        });
    }

    function pushCorkUndo(caseId, prog, beforeSnap) {
        const stacks = getCorkUndoStacks(caseId);
        stacks.undo.push(beforeSnap || snapshotCorkboard(prog));
        if (stacks.undo.length > 40) stacks.undo.shift();
        stacks.redo.length = 0;
    }

    function performCorkUndo(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const stacks = getCorkUndoStacks(c.id);
        if (stacks.undo.length === 0) return false;
        stacks.redo.push(snapshotCorkboard(prog));
        const restored = JSON.parse(stacks.undo.pop());
        prog.corkboard.nodes = restored.nodes || {};
        prog.corkboard.links = restored.links || [];
        prog.corkboard.confirmedKeys = restored.confirmedKeys || [];
        savePersistedData();
        updateCounters();
        triggerFeedback('small', null, { sound: 'paper' });
        renderCorkboardTab(host);
        return true;
    }

    function performCorkRedo(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const stacks = getCorkUndoStacks(c.id);
        if (stacks.redo.length === 0) return false;
        stacks.undo.push(snapshotCorkboard(prog));
        const restored = JSON.parse(stacks.redo.pop());
        prog.corkboard.nodes = restored.nodes || {};
        prog.corkboard.links = restored.links || [];
        prog.corkboard.confirmedKeys = restored.confirmedKeys || [];
        savePersistedData();
        updateCounters();
        triggerFeedback('small', null, { sound: 'paper' });
        renderCorkboardTab(host);
        return true;
    }

    function createCorkLink(c, prog, fromId, toId, relation, originEl) {
        if (!fromId || !toId || fromId === toId) {
            showToast('Escolha dois cartões diferentes para conectar.');
            return false;
        }
        const newLink = { from: fromId, to: toId, relation };
        const duplicate = prog.corkboard.links.some(l =>
            l.relation === newLink.relation &&
            ((l.from === newLink.from && l.to === newLink.to) || (l.from === newLink.to && l.to === newLink.from))
        );
        if (duplicate) {
            showToast('Essa conexão com a mesma relação já existe no mural.');
            return false;
        }
        pushCorkUndo(c.id, prog);
        prog.corkboard.links.push(newLink);

        const keyConns = c.keyConnections || [];
        let hitKey = false;
        keyConns.forEach((kc, kcIdx) => {
            if (matchesKeyConnection(kc, newLink) && !prog.corkboard.confirmedKeys.includes(kcIdx)) {
                prog.corkboard.confirmedKeys.push(kcIdx);
                hitKey = true;
                triggerFeedback('medium', originEl, { sound: 'breakthrough', particles: 'gold_spark' });
                showToast(`Conexão Pericial Confirmada: ${kc.insight}`);
            }
        });
        if (!hitKey) {
            triggerFeedback('small', originEl, { sound: 'pin' });
        }
        savePersistedData();
        evaluateAchievements(c, null);
        updateCounters();
        return true;
    }

    function renderCorkboardTab(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const items = buildCorkNodes(c, prog);
        const stacks = getCorkUndoStacks(c.id);

        items.forEach(item => {
            if (!prog.corkboard.nodes[item.id]) {
                prog.corkboard.nodes[item.id] = { x: item.defaultX, y: item.defaultY };
            }
        });

        if (!state.corkboard.selectedCardId || !items.some(i => i.id === state.corkboard.selectedCardId)) {
            state.corkboard.selectedCardId = items[0] ? items[0].id : null;
        }

        const keyConns = c.keyConnections || [];
        const zoomPct = Math.round(state.corkboard.zoom * 100);
        const maxCardY = items.reduce((m, it) => {
            const p = prog.corkboard.nodes[it.id] || { y: it.defaultY };
            return Math.max(m, p.y);
        }, 420);
        const stageH = Math.max(560, Math.ceil(maxCardY + 132));

        host.innerHTML = `
            <div class="section-title">
                <span>Mural de Conexões (Fios Vermelhos)</span>
                <span class="mono-label">Conexões Periciais Confirmadas: ${prog.corkboard.confirmedKeys.length}/${keyConns.length}</span>
            </div>

            <div class="cork-toolbar">
                <div class="cork-toolbar-group">
                    <label class="cork-inline-label">
                        <span>Relação:</span>
                        <select class="dossier-select cork-select-compact" id="cork-relation">
                            ${['contradiz', 'confirma', 'motivo', 'liga a'].map(rel =>
                                `<option value="${rel}" ${state.corkboard.relation === rel ? 'selected' : ''}>${rel.toUpperCase()}</option>`
                            ).join('')}
                        </select>
                    </label>
                    <button type="button" class="btn btn-sm ${state.corkboard.connectMode ? 'btn-danger' : 'btn-gold'}" id="btn-cork-connect-mode" aria-pressed="${state.corkboard.connectMode}">
                        ${icon('link', 13)}
                        <span>${state.corkboard.connectMode
                            ? (state.corkboard.pendingFrom ? 'Escolha o 2º Cartão (Cancelar)' : 'Fio Ativo — Escolha 1º Cartão')
                            : 'Ligar Fio Vermelho'}</span>
                    </button>
                </div>

                <div class="cork-toolbar-group">
                    <button type="button" class="btn btn-paper btn-sm" id="btn-cork-undo" ${stacks.undo.length === 0 ? 'disabled' : ''} title="Desfazer (Ctrl+Z)">
                        ${icon('undo', 13)}<span>Desfazer</span>
                    </button>
                    <button type="button" class="btn btn-paper btn-sm" id="btn-cork-redo" ${stacks.redo.length === 0 ? 'disabled' : ''} title="Refazer (Ctrl+Y)">
                        ${icon('redo', 13)}<span>Refazer</span>
                    </button>
                </div>

                <div class="cork-toolbar-group">
                    <button type="button" class="btn btn-paper btn-sm btn-icon" id="btn-cork-zoom-out" aria-label="Reduzir zoom do mural">${icon('zoom_out', 14)}</button>
                    <span class="cork-zoom-readout" id="cork-zoom-val">${zoomPct}%</span>
                    <button type="button" class="btn btn-paper btn-sm btn-icon" id="btn-cork-zoom-in" aria-label="Aumentar zoom do mural">${icon('zoom_in', 14)}</button>
                    <button type="button" class="btn btn-paper btn-sm" id="btn-cork-fit">${icon('fit', 13)}<span>Ajustar</span></button>
                    <button type="button" class="btn btn-paper btn-sm" id="btn-cork-auto">Auto-Organizar</button>
                    <button type="button" class="btn btn-paper btn-sm" id="btn-cork-clear">Limpar Fios</button>
                </div>
            </div>

            <!-- WCAG 2.2 SC 2.5.7 Drag-Free Alternative -->
            <details class="cork-a11y-bar" id="cork-a11y-bar" ${state.corkboard.a11yOpen ? 'open' : ''}>
                <summary class="cork-a11y-summary">
                    <span class="backlog-summary-left">${icon('move', 14)}<span>Conectar ou Mover Cartões Sem Arrastar (Teclado / Toque)</span></span>
                    <span class="mono-label" id="cork-a11y-summary-state">${state.corkboard.a11yOpen ? 'Recolher' : 'Abrir Controles'}</span>
                </summary>
                <div class="cork-a11y-grid">
                    <div class="cork-a11y-field">
                        <label for="cork-a11y-from" class="mono-label">Cartão de Origem</label>
                        <select id="cork-a11y-from" class="dossier-select cork-select-compact">
                            ${items.map(it => `<option value="${escapeHTML(it.id)}">${escapeHTML(it.title)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="cork-a11y-field">
                        <label for="cork-a11y-rel" class="mono-label">Relação</label>
                        <select id="cork-a11y-rel" class="dossier-select cork-select-compact">
                            ${['contradiz', 'confirma', 'motivo', 'liga a'].map(rel =>
                                `<option value="${rel}" ${state.corkboard.relation === rel ? 'selected' : ''}>${rel.toUpperCase()}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="cork-a11y-field">
                        <label for="cork-a11y-to" class="mono-label">Cartão de Destino</label>
                        <select id="cork-a11y-to" class="dossier-select cork-select-compact">
                            ${items.map((it, idx) => `<option value="${escapeHTML(it.id)}" ${idx === 1 ? 'selected' : ''}>${escapeHTML(it.title)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="cork-a11y-field">
                        <button type="button" class="btn btn-gold btn-sm" id="btn-cork-a11y-link">${icon('link', 13)}<span>Conectar Selecionados</span></button>
                    </div>
                </div>
                <div class="cork-toolbar-group cork-toolbar-secondary">
                    <label for="cork-a11y-move-target" class="mono-label">Mover cartão:</label>
                    <select id="cork-a11y-move-target" class="dossier-select cork-select-compact">
                        ${items.map(it => `<option value="${escapeHTML(it.id)}" ${state.corkboard.selectedCardId === it.id ? 'selected' : ''}>${escapeHTML(it.title)}</option>`).join('')}
                    </select>
                    <button type="button" class="btn btn-paper btn-sm cork-nudge" data-dx="-36" data-dy="0" aria-label="Mover cartão para a esquerda">${icon('arrow_left', 13)}</button>
                    <button type="button" class="btn btn-paper btn-sm cork-nudge" data-dx="0" data-dy="-36" aria-label="Mover cartão para cima">${icon('chevron_up', 13)}</button>
                    <button type="button" class="btn btn-paper btn-sm cork-nudge" data-dx="0" data-dy="36" aria-label="Mover cartão para baixo">${icon('chevron_down', 13)}</button>
                    <button type="button" class="btn btn-paper btn-sm cork-nudge" data-dx="36" data-dy="0" aria-label="Mover cartão para a direita">${icon('arrow_right', 13)}</button>
                </div>
            </details>

            <div class="cork-legend-row">
                <div class="cork-legend-items">
                    <span class="legend-swatch"><span class="legend-line legend-line-free" aria-hidden="true"></span><span>Fio Vermelho: Hipótese livre</span></span>
                    <span class="legend-swatch"><span class="legend-line legend-line-confirmed" aria-hidden="true"></span><span>Fio Dourado: Conexão pericial confirmada</span></span>
                </div>
                <span>Clique ou pressione Delete sobre uma etiqueta de fio para removê-lo.</span>
            </div>

            <div class="cork-insights">
                ${prog.corkboard.confirmedKeys.length === 0
                    ? `<span class="helper-text">Arraste ou use as setas para posicionar cartões. Ative <strong>Ligar Fio Vermelho</strong> e conecte um suspeito à prova que contradiz seu álibi.</span>`
                    : prog.corkboard.confirmedKeys.map(idx => {
                        const kc = keyConns[idx];
                        return kc ? `<div class="cork-insight-pill">${icon('check', 13)}<span>${escapeHTML(kc.insight)}</span></div>` : '';
                    }).join('')
                }
            </div>

            <div class="corkboard-viewport" id="corkboard-viewport">
                <div class="corkboard-zoom-box" id="corkboard-zoom-box">
                    <div class="corkboard-stage" id="corkboard-stage">
                        <svg class="cork-strings-svg" viewBox="0 0 960 ${stageH}" preserveAspectRatio="none" id="cork-svg"></svg>
                        ${items.map(item => {
                            const pos = prog.corkboard.nodes[item.id];
                            const isPending = state.corkboard.pendingFrom === item.id;
                            const isSelected = state.corkboard.selectedCardId === item.id;
                            return `
                                <div class="cork-card cork-${item.kind} ${isPending ? 'pending-link' : ''} ${isSelected ? 'selected-card' : ''}"
                                     data-node-id="${escapeHTML(item.id)}"
                                     tabindex="0"
                                     role="group"
                                     aria-label="Cartão ${escapeHTML(item.title)}. Use setas para mover ou Enter para selecionar."
                                     style="left:${pos.x}px; top:${pos.y}px;">
                                    <span class="cork-pin" aria-hidden="true"></span>
                                    ${item.kind === 'suspect'
                                        ? `<div class="cork-card-row">
                                             <div class="cork-thumb">${Art.getPortraitSVG(item.portrait, item.mood)}</div>
                                             <div>
                                               <div class="cork-title">${escapeHTML(item.title)}</div>
                                               <div class="cork-sub">${escapeHTML(item.subtitle)}</div>
                                             </div>
                                           </div>`
                                        : `<div class="cork-title">${escapeHTML(item.title)}</div>
                                           <div class="cork-sub">${escapeHTML(item.subtitle)}</div>`
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        const viewport = host.querySelector('#corkboard-viewport');
        const zoomBox = host.querySelector('#corkboard-zoom-box');
        const stage = host.querySelector('#corkboard-stage');
        const svg = host.querySelector('#cork-svg');
        const zoomReadout = host.querySelector('#cork-zoom-val');
        const a11yBar = host.querySelector('#cork-a11y-bar');
        const a11yMoveTarget = host.querySelector('#cork-a11y-move-target');

        stage.style.height = `${stageH}px`;
        svg.style.height = `${stageH}px`;

        function syncUndoRedoButtons() {
            const st = getCorkUndoStacks(c.id);
            const undoBtn = host.querySelector('#btn-cork-undo');
            const redoBtn = host.querySelector('#btn-cork-redo');
            if (undoBtn) undoBtn.disabled = st.undo.length === 0;
            if (redoBtn) redoBtn.disabled = st.redo.length === 0;
        }

        function setSelectedCard(nodeId) {
            state.corkboard.selectedCardId = nodeId;
            stage.querySelectorAll('.cork-card').forEach(el => {
                el.classList.toggle('selected-card', el.dataset.nodeId === nodeId);
            });
            if (a11yMoveTarget && a11yMoveTarget.value !== nodeId) {
                a11yMoveTarget.value = nodeId;
            }
        }

        function applyZoom(nextZoom) {
            const z = Math.max(0.30, Math.min(1.25, Math.round(nextZoom * 100) / 100));
            state.corkboard.zoom = z;
            stage.style.transform = `scale(${z})`;
            zoomBox.style.width = `${Math.round(960 * z)}px`;
            zoomBox.style.height = `${Math.round(stageH * z)}px`;
            if (zoomReadout) zoomReadout.textContent = `${Math.round(z * 100)}%`;
        }

        function fitCorkboardToView() {
            const avail = Math.max(280, viewport.clientWidth - 4);
            applyZoom(Math.min(1, avail / 960));
        }

        // Auto-fit once per case open when viewport is narrower than 960px
        if (state.corkboard.autoFitAppliedForCase !== c.id) {
            state.corkboard.autoFitAppliedForCase = c.id;
            if (viewport.clientWidth > 0 && viewport.clientWidth < 970) {
                fitCorkboardToView();
            } else {
                applyZoom(1);
            }
        } else {
            applyZoom(state.corkboard.zoom);
        }

        let rubberCoords = null;
        let rubberPathEl = null;

        function updateRubberLine() {
            if (!rubberPathEl) return;
            if (state.corkboard.connectMode && state.corkboard.pendingFrom && rubberCoords) {
                const pOrigin = prog.corkboard.nodes[state.corkboard.pendingFrom];
                if (pOrigin) {
                    const ox = pOrigin.x + 96;
                    const oy = pOrigin.y + 10;
                    const tx = rubberCoords.x;
                    const ty = rubberCoords.y;
                    const rmx = (ox + tx) / 2;
                    const rmy = (oy + ty) / 2 + 22;
                    rubberPathEl.setAttribute('d', `M ${ox} ${oy} Q ${rmx} ${rmy} ${tx} ${ty}`);
                    rubberPathEl.removeAttribute('hidden');
                    return;
                }
            }
            rubberPathEl.setAttribute('hidden', '');
            rubberPathEl.setAttribute('d', '');
        }

        function drawStrings() {
            const visibleSet = new Set(items.map(i => i.id));
            const titleMap = new Map(items.map(i => [i.id, i.title]));
            const lines = [];
            prog.corkboard.links.forEach((lk, linkIdx) => {
                if (!visibleSet.has(lk.from) || !visibleSet.has(lk.to)) return;
                const pA = prog.corkboard.nodes[lk.from];
                const pB = prog.corkboard.nodes[lk.to];
                if (!pA || !pB) return;
                const x1 = pA.x + 96;
                const y1 = pA.y + 10;
                const x2 = pB.x + 96;
                const y2 = pB.y + 10;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 + 28;
                const isKey = keyConns.some(kc => matchesKeyConnection(kc, lk));
                const strokeColor = isKey ? '#f0c24b' : '#d62828';
                const labelDesc = `Remover fio ${lk.relation} entre ${titleMap.get(lk.from) || lk.from} e ${titleMap.get(lk.to) || lk.to}`;
                lines.push(`
                    <g class="cork-string-group" data-link-idx="${linkIdx}" tabindex="0" role="button" aria-label="${escapeHTML(labelDesc)}">
                        <path class="cork-string-path" d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" fill="none" stroke="${strokeColor}" stroke-width="${isKey ? 3.2 : 2.3}" stroke-linecap="round" opacity="0.94"/>
                        <rect class="cork-string-tag" x="${mx - 42}" y="${my - 23}" width="84" height="19" rx="3" fill="#1d1612" stroke="${strokeColor}" stroke-width="1.1"/>
                        <text x="${mx}" y="${my - 10.5}" text-anchor="middle" fill="#f7ebd2" font-family="monospace" font-size="9" font-weight="bold">${escapeHTML(lk.relation.toUpperCase())} &times;</text>
                    </g>
                `);
            });

            lines.push(`<path id="cork-rubber-line" class="cork-rubber-line" d="" fill="none" hidden />`);
            svg.innerHTML = lines.join('');
            rubberPathEl = svg.querySelector('#cork-rubber-line');
            updateRubberLine();

            const removeLinkAt = idx => {
                pushCorkUndo(c.id, prog);
                prog.corkboard.links.splice(idx, 1);
                savePersistedData();
                triggerFeedback('small', null, { sound: 'click' });
                renderCorkboardTab(host);
            };

            svg.querySelectorAll('.cork-string-group').forEach(g => {
                g.addEventListener('click', () => removeLinkAt(Number(g.dataset.linkIdx)));
                g.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Delete' || e.key === 'Backspace') {
                        e.preventDefault();
                        removeLinkAt(Number(g.dataset.linkIdx));
                    }
                });
            });
        }

        drawStrings();

        // Rubber-band pointer tracking on stage (in-place SVG path mutation, zero innerHTML churn)
        stage.addEventListener('pointermove', e => {
            if (!state.corkboard.connectMode || !state.corkboard.pendingFrom) return;
            const rect = stage.getBoundingClientRect();
            const z = state.corkboard.zoom || 1;
            rubberCoords = {
                x: Math.max(0, Math.min(960, (e.clientX - rect.left) / z)),
                y: Math.max(0, Math.min(stageH, (e.clientY - rect.top) / z))
            };
            updateRubberLine();
        });

        stage.addEventListener('pointerleave', () => {
            if (rubberCoords) {
                rubberCoords = null;
                updateRubberLine();
            }
        });

        const maxYClamp = Math.max(460, stageH - 108);

        function nudgeCard(nodeId, dx, dy) {
            const pos = prog.corkboard.nodes[nodeId];
            if (!pos) return;
            const nx = Math.max(8, Math.min(755, Math.round(pos.x + dx)));
            const ny = Math.max(8, Math.min(maxYClamp, Math.round(pos.y + dy)));
            if (nx === pos.x && ny === pos.y) return;
            pushCorkUndo(c.id, prog);
            prog.corkboard.nodes[nodeId] = { x: nx, y: ny };
            savePersistedData();
            const el = stage.querySelector(`.cork-card[data-node-id="${CSS.escape(nodeId)}"]`);
            if (el) {
                el.style.left = `${nx}px`;
                el.style.top = `${ny}px`;
            }
            drawStrings();
            syncUndoRedoButtons();
        }

        // Card Dragging, Connect Mode & Keyboard Movement
        stage.querySelectorAll('.cork-card').forEach(cardEl => {
            const nodeId = cardEl.dataset.nodeId;

            cardEl.addEventListener('focus', () => {
                setSelectedCard(nodeId);
            });

            cardEl.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); nudgeCard(nodeId, -24, 0); return; }
                if (e.key === 'ArrowRight') { e.preventDefault(); nudgeCard(nodeId, 24, 0); return; }
                if (e.key === 'ArrowUp') { e.preventDefault(); nudgeCard(nodeId, 0, -24); return; }
                if (e.key === 'ArrowDown') { e.preventDefault(); nudgeCard(nodeId, 0, 24); return; }
                if ((e.key === 'Enter' || e.key === ' ') && state.corkboard.connectMode) {
                    e.preventDefault();
                    handleCardConnectClick(nodeId, cardEl);
                }
            });

            const handleCardConnectClick = (clickedId, el) => {
                if (!state.corkboard.pendingFrom) {
                    state.corkboard.pendingFrom = clickedId;
                    triggerFeedback('small', el, { sound: 'pin' });
                    renderCorkboardTab(host);
                    return;
                }
                if (state.corkboard.pendingFrom === clickedId) {
                    state.corkboard.pendingFrom = null;
                    renderCorkboardTab(host);
                    return;
                }
                createCorkLink(c, prog, state.corkboard.pendingFrom, clickedId, state.corkboard.relation, el);
                state.corkboard.pendingFrom = null;
                renderCorkboardTab(host);
            };

            cardEl.addEventListener('pointerdown', e => {
                setSelectedCard(nodeId);
                if (state.corkboard.connectMode) {
                    e.preventDefault();
                    handleCardConnectClick(nodeId, cardEl);
                    return;
                }

                e.preventDefault();
                try { cardEl.setPointerCapture(e.pointerId); } catch (_) { }
                const startX = e.clientX;
                const startY = e.clientY;
                const origPos = prog.corkboard.nodes[nodeId];
                const ox = origPos.x;
                const oy = origPos.y;
                const beforeSnap = snapshotCorkboard(prog);
                let moved = false;
                cardEl.classList.add('dragging');

                const onMove = ev => {
                    const z = state.corkboard.zoom || 1;
                    const nx = Math.max(8, Math.min(755, Math.round(ox + (ev.clientX - startX) / z)));
                    const ny = Math.max(8, Math.min(maxYClamp, Math.round(oy + (ev.clientY - startY) / z)));
                    if (nx !== prog.corkboard.nodes[nodeId].x || ny !== prog.corkboard.nodes[nodeId].y) {
                        moved = true;
                        prog.corkboard.nodes[nodeId] = { x: nx, y: ny };
                        cardEl.style.left = `${nx}px`;
                        cardEl.style.top = `${ny}px`;
                        drawStrings();
                    }
                };

                const onUp = () => {
                    cardEl.classList.remove('dragging');
                    cardEl.removeEventListener('pointermove', onMove);
                    cardEl.removeEventListener('pointerup', onUp);
                    cardEl.removeEventListener('pointercancel', onUp);
                    if (moved) {
                        pushCorkUndo(c.id, prog, beforeSnap);
                        savePersistedData();
                        syncUndoRedoButtons();
                    }
                };

                cardEl.addEventListener('pointermove', onMove);
                cardEl.addEventListener('pointerup', onUp);
                cardEl.addEventListener('pointercancel', onUp);
            });
        });

        if (a11yBar) {
            a11yBar.addEventListener('toggle', () => {
                state.corkboard.a11yOpen = a11yBar.open;
                const stEl = host.querySelector('#cork-a11y-summary-state');
                if (stEl) stEl.textContent = a11yBar.open ? 'Recolher' : 'Abrir Controles';
            });
        }
        if (a11yMoveTarget) {
            a11yMoveTarget.addEventListener('change', e => {
                setSelectedCard(e.target.value);
            });
        }

        host.querySelector('#cork-relation').addEventListener('change', e => {
            state.corkboard.relation = e.target.value;
            const a11yRel = host.querySelector('#cork-a11y-rel');
            if (a11yRel) a11yRel.value = e.target.value;
        });

        const a11yRelEl = host.querySelector('#cork-a11y-rel');
        if (a11yRelEl) {
            a11yRelEl.addEventListener('change', e => {
                state.corkboard.relation = e.target.value;
                const mainRel = host.querySelector('#cork-relation');
                if (mainRel) mainRel.value = e.target.value;
            });
        }

        host.querySelector('#btn-cork-connect-mode').addEventListener('click', () => {
            state.corkboard.connectMode = !state.corkboard.connectMode;
            state.corkboard.pendingFrom = null;
            triggerFeedback('small', null, { sound: 'click' });
            renderCorkboardTab(host);
        });

        host.querySelector('#btn-cork-undo').addEventListener('click', () => performCorkUndo(host));
        host.querySelector('#btn-cork-redo').addEventListener('click', () => performCorkRedo(host));
        host.querySelector('#btn-cork-zoom-out').addEventListener('click', () => applyZoom(state.corkboard.zoom - 0.1));
        host.querySelector('#btn-cork-zoom-in').addEventListener('click', () => applyZoom(state.corkboard.zoom + 0.1));
        host.querySelector('#btn-cork-fit').addEventListener('click', fitCorkboardToView);

        host.querySelector('#btn-cork-auto').addEventListener('click', () => {
            pushCorkUndo(c.id, prog);
            items.forEach(item => {
                prog.corkboard.nodes[item.id] = { x: item.defaultX, y: item.defaultY };
            });
            savePersistedData();
            triggerFeedback('small', null, { sound: 'paper' });
            renderCorkboardTab(host);
        });

        host.querySelector('#btn-cork-clear').addEventListener('click', () => {
            if (prog.corkboard.links.length === 0) return;
            pushCorkUndo(c.id, prog);
            prog.corkboard.links = [];
            savePersistedData();
            triggerFeedback('small', null, { sound: 'paper' });
            renderCorkboardTab(host);
        });

        host.querySelector('#btn-cork-a11y-link').addEventListener('click', e => {
            const fromId = host.querySelector('#cork-a11y-from').value;
            const rel = host.querySelector('#cork-a11y-rel').value;
            const toId = host.querySelector('#cork-a11y-to').value;
            state.corkboard.relation = rel;
            state.corkboard.a11yOpen = true;
            if (createCorkLink(c, prog, fromId, toId, rel, e.currentTarget)) {
                renderCorkboardTab(host);
                const btnAgain = host.querySelector('#btn-cork-a11y-link');
                if (btnAgain) btnAgain.focus();
            }
        });

        host.querySelectorAll('.cork-nudge').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!state.corkboard.selectedCardId) return;
                nudgeCard(state.corkboard.selectedCardId, Number(btn.dataset.dx), Number(btn.dataset.dy));
            });
        });
    }

    /* =========================================================================
       13. ABA 5: LINHA DO TEMPO
       ========================================================================= */
    function renderTimelineTab(host) {
        const c = getCaseById(state.currentCaseId);
        const visibleEvIds = new Set(getVisibleEvidences(c).map(e => e.id));
        const events = c.timeline.filter(ev => !ev.requiresEvidence || visibleEvIds.has(ev.requiresEvidence));

        host.innerHTML = `
            <div class="section-title">
                <span>Reconstrução Cronológica</span>
                <span class="mono-label">Atualizada com as provas coletadas</span>
            </div>
            <div class="timeline-banner">
                <span class="timeline-banner-main">
                    ${icon('clock', 15)}
                    <span>${escapeHTML(c.crimeWindowLabel)}</span>
                </span>
                <span>Eventos destacados ocorrem na janela crítica</span>
            </div>
            <div class="timeline-list">
                ${events.map(item => `
                    <div class="timeline-item ${item.crimeWindow ? 'crime-window' : ''} ${item.requiresEvidence ? 'unlocked-event' : ''}">
                        <div class="timeline-item-head">
                            <div>
                                <span class="timeline-time">${escapeHTML(item.time)}</span>
                                ${item.crimeWindow ? `<span class="timeline-window-tag">[JANELA CRÍTICA]</span>` : ''}
                            </div>
                            <span class="timeline-source">${escapeHTML(item.source)}</span>
                        </div>
                        <p class="timeline-text">${escapeHTML(item.text)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /* =========================================================================
       14. ABA 6: QUADRO DE ACUSAÇÃO & MÚLTIPLOS FINAIS / EPÍLOGOS
       ========================================================================= */
    function renderAccuseTab(host) {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const isLockedOut = prog.authority <= 0;

        host.innerHTML = `
            <div class="section-title">
                <span>Quadro de Acusação Formal</span>
                <span class="mono-label">Encerramento do Inquérito</span>
            </div>
            <form class="accusation-form" id="accusation-form">
                <div class="accusation-step">
                    <fieldset class="accusation-fieldset">
                        <legend>1. Quem é o verdadeiro culpado pelo crime?</legend>
                        <div class="radio-grid">
                            ${c.suspects.map(s => `
                                <label class="radio-option">
                                    <input type="radio" name="culprit" value="${escapeHTML(s.id)}" ${prog.lastAttempt?.culprit === s.id ? 'checked' : ''} />
                                    <span><strong>${escapeHTML(s.name)}</strong><span class="radio-sub">${escapeHTML(s.role)}</span></span>
                                </label>
                            `).join('')}
                        </div>
                    </fieldset>
                </div>

                <div class="accusation-step">
                    <fieldset class="accusation-fieldset">
                        <legend>2. Qual foi o método / arma utilizada?</legend>
                        <div class="radio-grid">
                            ${c.accusationOptions.methods.map(m => `
                                <label class="radio-option">
                                    <input type="radio" name="method" value="${escapeHTML(m.id)}" ${prog.lastAttempt?.method === m.id ? 'checked' : ''} />
                                    <span>${escapeHTML(m.label)}</span>
                                </label>
                            `).join('')}
                        </div>
                    </fieldset>
                </div>

                <div class="accusation-step">
                    <fieldset class="accusation-fieldset">
                        <legend>3. Qual evidência quebra definitivamente o álibi do culpado?</legend>
                        <div class="radio-grid">
                            ${c.accusationOptions.alibiBreakers.map(a => `
                                <label class="radio-option">
                                    <input type="radio" name="alibiBreaker" value="${escapeHTML(a.id)}" ${prog.lastAttempt?.alibiBreaker === a.id ? 'checked' : ''} />
                                    <span>${escapeHTML(a.label)}</span>
                                </label>
                            `).join('')}
                        </div>
                    </fieldset>
                </div>

                <div class="accusation-submit-wrap">
                    <button type="submit" class="btn btn-danger btn-lg" ${isLockedOut ? 'disabled' : ''}>
                        ${icon('scales', 16)}
                        <span>${isLockedOut ? 'Autoridade Esgotada (Reabra o Inquérito)' : 'Assinar Mandado e Carimbar Veredito'}</span>
                    </button>
                </div>
            </form>

            <div id="result-slot">
                ${prog.lastAttempt ? renderResultHTML(c, prog.lastAttempt, prog) : ''}
            </div>
        `;

        bindResultActions(host, c, prog);

        host.querySelector('#accusation-form').addEventListener('submit', e => {
            e.preventDefault();
            if (prog.authority <= 0) {
                openAuthorityLockoutModal(c);
                return;
            }
            const fd = new FormData(e.target);
            const culprit = fd.get('culprit');
            const method = fd.get('method');
            const alibiBreaker = fd.get('alibiBreaker');

            if (!culprit || !method || !alibiBreaker) {
                showToast('Preencha todas as 3 etapas da acusação antes de assinar o mandado.');
                return;
            }

            const okCulprit = culprit === c.solution.culpritId;
            const okMethod = method === c.solution.methodId;
            const okAlibi = alibiBreaker === c.solution.alibiBreakerId;
            const perfect = okCulprit && okMethod && okAlibi;

            const baseScore = (okCulprit ? 45 : 0) + (okMethod ? 25 : 0) + (okAlibi ? 30 : 0);
            const hintPenalties = [0, 10, 25, 50];
            const penalty = hintPenalties[Math.min(prog.hintsUsed, 3)];
            const bonus = Math.min(prog.crackedSuspects.length * 5, 10);
            const finalScore = Math.max(0, Math.min(100, baseScore + (perfect ? bonus : 0) - penalty));
            const rank = calculateCaseRank(finalScore, perfect);

            const attempt = { culprit, method, alibiBreaker, okCulprit, okMethod, okAlibi, perfect, finalScore, penalty, rank };
            prog.lastAttempt = attempt;

            if (perfect) {
                prog.solved = true;
                if (prog.bestScore === null || finalScore > prog.bestScore) {
                    prog.bestScore = finalScore;
                    prog.bestRank = rank;
                }
                state.showOfficialRevealAfterFail = true;
                triggerFeedback('large', null, { sound: 'stamp', trauma: 0.7, vignette: 'gold', particles: 'stamp_success' });
            } else {
                const wrongKey = `${c.id}:${culprit}`;
                if (!okCulprit && !(persisted.profile.wrongEndingsSeen || []).includes(wrongKey)) {
                    persisted.profile.wrongEndingsSeen.push(wrongKey);
                }
                triggerFeedback('large', null, { sound: 'stamp', trauma: 0.65, vignette: 'red', particles: 'stamp_fail' });
                applyAuthorityPenalty(c, 40, 'Mandado contestado pelo tribunal', { silentFeedback: true });
                renderAuthorityBar();
            }

            savePersistedData();
            evaluateAchievements(c, attempt);
            renderCaseSelector();
            const resultSlot = host.querySelector('#result-slot');
            resultSlot.innerHTML = renderResultHTML(c, attempt, prog);
            bindResultActions(host, c, prog);
            if (!getTopOverlay()) {
                resultSlot.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
            }
        });
    }

    function renderResultHTML(c, attempt, prog) {
        const cases = getAllCases();
        const curIdx = cases.findIndex(x => x.id === c.id);
        const nextCase = curIdx >= 0 && curIdx + 1 < cases.length ? cases[curIdx + 1] : null;
        const wrongEndings = c.solution.wrongEndings || {};

        const trueCulprit = c.suspects.find(s => s.id === c.solution.culpritId)?.name || c.solution.culpritId;
        const trueMethod = c.accusationOptions.methods.find(m => m.id === c.solution.methodId)?.label || c.solution.methodId;
        const trueAlibi = c.accusationOptions.alibiBreakers.find(a => a.id === c.solution.alibiBreakerId)?.label || c.solution.alibiBreakerId;

        if (!attempt.perfect) {
            const epilogue = attempt.okCulprit
                ? (wrongEndings._partial || wrongEndings._default || { title: 'Mandado Tecnicamente Incompleto', text: 'Você apontou o culpado certo, mas errou o método ou a prova de quebra de álibi.' })
                : (wrongEndings[attempt.culprit] || wrongEndings._default || { title: 'Inquérito Contestado', text: 'As evidências não sustentaram a acusação contra este suspeito.' });

            return `
                <div class="result-box">
                    <div class="verdict-header">
                        <div>
                            <h3 class="verdict-title verdict-title-fail">${escapeHTML(epilogue.title)}</h3>
                            <span class="mono-label">Epílogo Alternativo — Consequência da Acusação</span>
                        </div>
                        <div class="big-stamp fail stamp-slam">MANDADO CONTESTADO</div>
                    </div>

                    <div class="epilogue-box">
                        <p>${escapeHTML(epilogue.text)}</p>
                    </div>

                    <ul class="checklist-result">
                        <li class="${attempt.okCulprit ? 'ok' : 'err'}">${attempt.okCulprit ? icon('check', 15) : icon('close', 15)}<span><strong>Autoria:</strong> ${attempt.okCulprit ? 'Correta' : 'Incorreta — inocente detido!'}</span></li>
                        <li class="${attempt.okMethod ? 'ok' : 'err'}">${attempt.okMethod ? icon('check', 15) : icon('close', 15)}<span><strong>Método:</strong> ${attempt.okMethod ? 'Correto' : 'Divergente da perícia'}</span></li>
                        <li class="${attempt.okAlibi ? 'ok' : 'err'}">${attempt.okAlibi ? icon('check', 15) : icon('close', 15)}<span><strong>Quebra de Álibi:</strong> ${attempt.okAlibi ? 'Correta' : 'Não derrubou o álibi'}</span></li>
                    </ul>

                    <div class="result-actions">
                        <button type="button" class="btn btn-paper" id="btn-retry-accuse">${icon('refresh', 14)}<span>Revisar Dossiê e Corrigir</span></button>
                        <button type="button" class="btn" id="btn-toggle-spoiler">
                            ${state.showOfficialRevealAfterFail ? 'Ocultar Solução Oficial' : 'Desistir e Ver Solução Oficial'}
                        </button>
                    </div>

                    ${state.showOfficialRevealAfterFail ? `
                        <div class="reconstruction-box">
                            <div class="mono-label">Gabarito Oficial (${escapeHTML(trueCulprit)})</div>
                            <p class="recon-line"><strong>Método:</strong> ${escapeHTML(trueMethod)} | <strong>Prova-Chave:</strong> ${escapeHTML(trueAlibi)}</p>
                            <p>${escapeHTML(c.solution.explanation)}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        const revealHeader = c.id === 'caso-06'
            ? 'Conexão Final Revelada — Sindicato Tung Tung Tung Sahur Desmantelado'
            : c.isParallel
                ? 'Desfecho do Caso Paralelo'
                : 'Conexão Revelada — Força-Tarefa 03h33';

        return `
            <div class="result-box">
                <div class="verdict-header">
                    <div>
                        <h3 class="verdict-title">Dedução Impecável! Caso Resolvido.</h3>
                        <span class="mono-label">Relatório Final da Promotoria</span>
                    </div>
                    <div class="big-stamp success stamp-slam">CASO ENCERRADO</div>
                </div>

                <div class="score-grid">
                    <div class="score-card"><div class="mono-label">Pontuação</div><div class="val">${attempt.finalScore} / 100</div></div>
                    <div class="score-card"><div class="mono-label">Avaliação</div><div class="val val-rank">${escapeHTML(attempt.rank)}</div></div>
                    <div class="score-card"><div class="mono-label">Autoridade</div><div class="val">${prog.authority}%</div></div>
                    <div class="score-card"><div class="mono-label">Contradições</div><div class="val">${prog.crackedSuspects.length}</div></div>
                </div>

                <ul class="checklist-result">
                    <li class="ok">${icon('check', 15)}<span><strong>Culpado Correto:</strong> ${escapeHTML(trueCulprit)}.</span></li>
                    <li class="ok">${icon('check', 15)}<span><strong>Método Correto:</strong> ${escapeHTML(trueMethod)}.</span></li>
                    <li class="ok">${icon('check', 15)}<span><strong>Quebra de Álibi Correta:</strong> ${escapeHTML(trueAlibi)}.</span></li>
                </ul>

                <div class="reconstruction-box">
                    <div class="mono-label">Reconstrução Oficial dos Fatos</div>
                    <p class="recon-explanation">${escapeHTML(c.solution.explanation)}</p>
                </div>

                ${c.solution.syndicateClue ? `
                    <div class="syndicate-reveal-box">
                        <div class="mono-label-dark mono-label-brass">${escapeHTML(revealHeader)}</div>
                        <p class="syndicate-reveal-text">${escapeHTML(c.solution.syndicateClue)}</p>
                    </div>
                ` : ''}

                <div class="result-actions">
                    <button type="button" class="btn btn-paper" id="btn-back-career">${icon('arrow_left', 14)}<span>Voltar à Central de Carreira</span></button>
                    ${nextCase && isCaseUnlocked(nextCase)
                        ? `<button type="button" class="btn btn-gold" id="btn-next-case" data-next-case-id="${escapeHTML(nextCase.id)}"><span>Avançar para ${escapeHTML(nextCase.code)}: ${escapeHTML(nextCase.title)}</span>${icon('arrow_right', 14)}</button>`
                        : ''}
                </div>
            </div>
        `;
    }

    function bindResultActions(host, c, prog) {
        const btnRetry = host.querySelector('#btn-retry-accuse');
        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                global.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            });
        }
        const btnToggle = host.querySelector('#btn-toggle-spoiler');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                state.showOfficialRevealAfterFail = !state.showOfficialRevealAfterFail;
                const slot = host.querySelector('#result-slot');
                slot.innerHTML = renderResultHTML(c, prog.lastAttempt, prog);
                bindResultActions(host, c, prog);
            });
        }
        const btnCareer = host.querySelector('#btn-back-career');
        if (btnCareer) {
            btnCareer.addEventListener('click', () => {
                state.view = 'home';
                renderAll();
                global.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            });
        }
        const btnNext = host.querySelector('#btn-next-case');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                openCase(btnNext.dataset.nextCaseId);
            });
        }
    }

    /* =========================================================================
       15. COMPARADOR LADO A LADO
       ========================================================================= */
    function openComparator(leftKey, rightKey) {
        const c = getCaseById(state.currentCaseId);
        const visibleEv = getVisibleEvidences(c);
        if (!leftKey) leftKey = `suspect:${c.suspects[0].id}`;
        if (!rightKey) rightKey = visibleEv[0] ? `evidence:${visibleEv[0].id}` : 'timeline:all';

        state.comparator.left = leftKey;
        state.comparator.right = rightKey;
        persisted.profile.comparatorUsed = true;
        savePersistedData();
        evaluateAchievements(c, null);

        renderComparatorModal();
        pushOverlay(comparatorModal);
        triggerFeedback('small', null, { sound: 'paper' });
    }

    function formatDocText(rawText, highlightTimes) {
        let safe = escapeHTML(rawText);
        if (highlightTimes) {
            safe = safe.replace(/\b(\d{2}h\d{2})\b/g, '<mark class="time-highlight">$1</mark>');
        }
        return safe;
    }

    function renderComparatorSlot(c, prog, key, highlightTimes) {
        if (key && key.startsWith('suspect:')) {
            const sid = key.slice('suspect:'.length);
            const s = c.suspects.find(x => x.id === sid);
            if (!s) return '<p>Suspeito não encontrado.</p>';
            const asked = prog.askedQuestions[s.id] || [];
            return `
                <div class="comp-doc">
                    <div class="comp-suspect-head">
                        <div class="cork-thumb">${Art.getPortraitSVG(s.portrait, getSuspectMood(prog, s))}</div>
                        <div>
                            <strong>${escapeHTML(s.name)}</strong>
                            <div class="suspect-mini-role">${escapeHTML(s.role)}</div>
                        </div>
                    </div>
                    <div class="mono-label">Depoimento</div>
                    <p class="comp-quote">"${formatDocText(s.statement, highlightTimes)}"</p>
                    <div class="mono-label">Álibi Declarado</div>
                    <p class="comp-body-copy">${formatDocText(s.alibi, highlightTimes)}</p>
                    ${asked.length > 0 ? `<div class="mono-label">Respostas Coletadas</div>
                        <ul class="comp-list">
                            ${s.questions.filter(q => asked.includes(q.id)).map(q => `<li><strong>${escapeHTML(q.q)}</strong><br/>${formatDocText(q.a, highlightTimes)}</li>`).join('')}
                        </ul>` : ''}
                </div>
            `;
        }
        if (key && key.startsWith('evidence:')) {
            const eid = key.slice('evidence:'.length);
            const ev = getVisibleEvidences(c).find(e => e.id === eid);
            if (!ev) return '<p>Evidência ainda não coletada.</p>';
            return `
                <div class="comp-doc">
                    <div class="evidence-code">${escapeHTML(ev.code)} &bull; ${escapeHTML(ev.title)}</div>
                    <p class="helper-text comp-ev-desc">${escapeHTML(ev.desc)}</p>
                    <div class="evidence-doc">${formatDocText(ev.doc, highlightTimes)}</div>
                </div>
            `;
        }
        const visibleEvIds = new Set(getVisibleEvidences(c).map(e => e.id));
        const evs = c.timeline.filter(t => !t.requiresEvidence || visibleEvIds.has(t.requiresEvidence));
        return `
            <div class="comp-doc">
                <div class="mono-label">Linha do Tempo (${escapeHTML(c.crimeWindowLabel)})</div>
                <ul class="comp-list">
                    ${evs.map(t => `<li><strong>${escapeHTML(t.time)}</strong> — ${formatDocText(t.text, highlightTimes)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    function renderComparatorModal() {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const visibleEvs = getVisibleEvidences(c);
        const optionsHTML = selectedVal => `
            <optgroup label="Suspeitos">
                ${c.suspects.map(s => `<option value="suspect:${escapeHTML(s.id)}" ${selectedVal === 'suspect:' + s.id ? 'selected' : ''}>Suspeito: ${escapeHTML(s.name)}</option>`).join('')}
            </optgroup>
            <optgroup label="Evidências Coletadas">
                ${visibleEvs.map(ev => `<option value="evidence:${escapeHTML(ev.id)}" ${selectedVal === 'evidence:' + ev.id ? 'selected' : ''}>${escapeHTML(ev.code)} — ${escapeHTML(ev.title)}</option>`).join('')}
            </optgroup>
            <optgroup label="Cronologia">
                <option value="timeline:all" ${selectedVal === 'timeline:all' ? 'selected' : ''}>Linha do Tempo Completa</option>
            </optgroup>
        `;

        const l = state.comparator.left;
        const r = state.comparator.right;
        let quickConfrontPair = null;
        if (l.startsWith('suspect:') && r.startsWith('evidence:')) quickConfrontPair = { s: l.slice(8), e: r.slice(9) };
        else if (r.startsWith('suspect:') && l.startsWith('evidence:')) quickConfrontPair = { s: r.slice(8), e: l.slice(9) };

        const body = document.getElementById('comparator-body');
        body.innerHTML = `
            <div class="comp-toolbar">
                <button type="button" class="btn btn-paper btn-sm" id="btn-comp-swap">${icon('swap', 14)}<span>Trocar Lados</span></button>
                <label class="toggle-pill toggle-pill-paper">
                    <input type="checkbox" id="chk-comp-times" ${state.comparator.highlightTimes ? 'checked' : ''} />
                    <span>Destacar Horários (00h00)</span>
                </label>
                ${quickConfrontPair ? `<button type="button" class="btn btn-danger btn-sm" id="btn-comp-confront"><span>Ir Confrontar na Sala</span>${icon('arrow_right', 13)}</button>` : ''}
            </div>
            <div class="comparator-grid">
                <div class="comp-pane">
                    <select class="dossier-select" id="comp-select-left" aria-label="Documento à esquerda">${optionsHTML(l)}</select>
                    <div class="comp-pane-content">${renderComparatorSlot(c, prog, l, state.comparator.highlightTimes)}</div>
                </div>
                <div class="comp-pane">
                    <select class="dossier-select" id="comp-select-right" aria-label="Documento à direita">${optionsHTML(r)}</select>
                    <div class="comp-pane-content">${renderComparatorSlot(c, prog, r, state.comparator.highlightTimes)}</div>
                </div>
            </div>
        `;

        body.querySelector('#comp-select-left').addEventListener('change', e => {
            state.comparator.left = e.target.value;
            renderComparatorModal();
        });
        body.querySelector('#comp-select-right').addEventListener('change', e => {
            state.comparator.right = e.target.value;
            renderComparatorModal();
        });
        body.querySelector('#btn-comp-swap').addEventListener('click', () => {
            const tmp = state.comparator.left;
            state.comparator.left = state.comparator.right;
            state.comparator.right = tmp;
            triggerFeedback('small', null, { sound: 'paper' });
            renderComparatorModal();
        });
        body.querySelector('#chk-comp-times').addEventListener('change', e => {
            state.comparator.highlightTimes = e.target.checked;
            renderComparatorModal();
        });
        const btnConf = body.querySelector('#btn-comp-confront');
        if (btnConf && quickConfrontPair) {
            btnConf.addEventListener('click', () => {
                popOverlay(false);
                state.selectedSuspectId = quickConfrontPair.s;
                state.activeTab = 'suspects';
                updateTabButtons();
                renderActiveTab();
                const sel = document.getElementById('confront-select');
                if (sel) sel.value = quickConfrontPair.e;
                showToast('Evidência pré-selecionada para confronto!');
            });
        }
    }

    /* =========================================================================
       16. MODAIS AUXILIARES, DICAS, CONFIGURAÇÕES DE ÁUDIO & ATALHOS GLOBAIS
       ========================================================================= */
    function openCustomCaseModal() {
        pushOverlay(customCaseModal, {
            initialFocus: document.getElementById('custom-case-textarea')
        });
    }

    function renderHintsModal() {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const list = document.getElementById('hint-list');
        const hints = c.hints || [];

        if (prog.hintsUsed === 0) {
            list.innerHTML = `<p class="helper-text">Nenhuma dica solicitada ainda para este caso. Clique abaixo para receber uma pista sutil do Legista Chefe.</p>`;
        } else {
            list.innerHTML = hints.slice(0, prog.hintsUsed).map(h => `<div class="hint-card">${escapeHTML(h)}</div>`).join('');
        }

        const btnUnlock = document.getElementById('btn-unlock-hint');
        if (prog.hintsUsed >= hints.length) {
            btnUnlock.disabled = true;
            btnUnlock.textContent = 'Todas as Dicas Liberadas';
        } else {
            btnUnlock.disabled = false;
            btnUnlock.textContent = `Solicitar Dica Nível ${prog.hintsUsed + 1}`;
        }
    }

    function applyPersistedAudioAndFeel() {
        AudioFX.setEnabled(persisted.profile.soundEnabled !== false);
        AudioFX.setAmbienceMode(persisted.profile.ambienceMode || 'rain_jazz');
        AudioFX.applyBusVolumes(persisted.profile.audioBuses);
    }

    function syncAudioSettingsUI() {
        const soundOn = persisted.profile.soundEnabled !== false;
        const btnSound = document.getElementById('btn-sound');
        const soundIcon = document.getElementById('sound-icon');
        const soundLabel = document.getElementById('sound-label');
        if (soundIcon) soundIcon.innerHTML = soundOn ? icon('sound_on', 14) : icon('sound_off', 14);
        if (soundLabel) soundLabel.textContent = soundOn ? 'Som: ON' : 'Som: OFF';
        if (btnSound) btnSound.setAttribute('aria-pressed', String(soundOn));

        const selAmb = document.getElementById('sel-ambience-mode');
        if (selAmb) selAmb.value = persisted.profile.ambienceMode || 'rain_jazz';

        const buses = persisted.profile.audioBuses || {};
        ['ambience', 'music', 'sfx', 'ui'].forEach(bus => {
            const pct = Math.round((buses[bus] ?? 0.65) * 100);
            const range = document.getElementById(`range-bus-${bus}`);
            const valEl = document.getElementById(`val-bus-${bus}`);
            if (range) range.value = String(pct);
            if (valEl) valEl.textContent = `${pct}%`;
        });

        const selSpeed = document.getElementById('sel-text-speed');
        if (selSpeed) selSpeed.value = persisted.profile.textSpeed || 'normal';

        const shakePct = Math.round((persisted.profile.shakeIntensity ?? 0.8) * 100);
        const rangeShake = document.getElementById('range-shake-intensity');
        const valShake = document.getElementById('val-shake-intensity');
        if (rangeShake) rangeShake.value = String(shakePct);
        if (valShake) valShake.textContent = `${shakePct}%`;

        const chkFlash = document.getElementById('chk-reduce-flashes');
        if (chkFlash) chkFlash.checked = Boolean(persisted.profile.reduceFlashes);
    }

    function openNotebookDrawer() {
        const c = getCaseById(state.currentCaseId);
        const prog = ensureCaseProgress(c.id);
        const labelEl = document.getElementById('notebook-case-label');
        const areaEl = document.getElementById('notebook-textarea');
        if (labelEl) labelEl.textContent = `${c.code} — ${c.title}`;
        if (areaEl) areaEl.value = prog.notes || '';
        triggerFeedback('small', null, { sound: 'paper' });
        if (state.view === 'case') {
            prog.notebookOpened = true;
            savePersistedData();
        }
        pushOverlay(notebookDrawer, {
            initialFocus: areaEl
        });
    }

    function openHintModal() {
        if (state.view !== 'case') return;
        triggerFeedback('small', null, { sound: 'click' });
        renderHintsModal();
        pushOverlay(hintModal);
    }

    function bindGlobalEvents() {
        document.getElementById('btn-home-nav').addEventListener('click', () => {
            cancelTypewriter();
            triggerFeedback('small', null, { sound: 'paper' });
            closeOverlays(false);
            state.view = 'home';
            renderAll();
        });

        document.getElementById('btn-comparator-open').addEventListener('click', () => {
            openComparator(state.comparator.left, state.comparator.right);
        });

        // Case Workspace Tabs: click + arrow keyboard nav (WCAG ARIA Tabs)
        const caseTabs = Array.from(document.querySelectorAll('.tab-btn'));
        caseTabs.forEach((btn, idx) => {
            btn.addEventListener('click', () => switchCaseTab(btn.dataset.tab, false));
            btn.addEventListener('keydown', e => {
                let targetIdx = null;
                if (e.key === 'ArrowRight') targetIdx = (idx + 1) % caseTabs.length;
                else if (e.key === 'ArrowLeft') targetIdx = (idx - 1 + caseTabs.length) % caseTabs.length;
                else if (e.key === 'Home') targetIdx = 0;
                else if (e.key === 'End') targetIdx = caseTabs.length - 1;
                if (targetIdx !== null) {
                    e.preventDefault();
                    switchCaseTab(caseTabs[targetIdx].dataset.tab, true);
                }
            });
        });

        document.getElementById('btn-notebook').addEventListener('click', openNotebookDrawer);
        document.getElementById('btn-close-notebook').addEventListener('click', () => popOverlay(false));

        document.getElementById('notebook-textarea').addEventListener('input', e => {
            const prog = ensureCaseProgress(state.currentCaseId);
            prog.notebookOpened = true;
            prog.notes = e.target.value;
            savePersistedData();
            document.getElementById('notebook-status').textContent = 'Salvo às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        });

        document.getElementById('btn-clear-notes').addEventListener('click', () => {
            const prog = ensureCaseProgress(state.currentCaseId);
            prog.notes = '';
            document.getElementById('notebook-textarea').value = '';
            savePersistedData();
            showToast('Anotações deste caso apagadas.');
        });

        document.getElementById('btn-hint').addEventListener('click', openHintModal);
        document.getElementById('btn-close-hint').addEventListener('click', () => popOverlay(false));
        document.getElementById('btn-close-puzzle').addEventListener('click', () => popOverlay(false));
        document.getElementById('btn-close-comparator').addEventListener('click', () => popOverlay(false));
        document.getElementById('btn-close-custom-modal').addEventListener('click', () => popOverlay(false));
        document.getElementById('btn-close-shortcuts').addEventListener('click', () => popOverlay(false));
        document.getElementById('btn-shortcuts').addEventListener('click', () => {
            triggerFeedback('small', null, { sound: 'click' });
            pushOverlay(shortcutsModal);
        });

        // Diegetic Dialog Confirm/Cancel bindings
        const closeDialog = () => popOverlay(false);
        document.getElementById('btn-close-dialog').addEventListener('click', closeDialog);
        document.getElementById('dialog-cancel').addEventListener('click', closeDialog);
        const submitDialog = () => {
            const fn = activeDialogResolve;
            const inputWrap = document.getElementById('dialog-input-wrap');
            const val = inputWrap.hidden ? true : document.getElementById('dialog-input').value;
            if (typeof fn === 'function') {
                const ok = fn(val);
                if (ok === false) return;
            }
            popOverlay(false);
        };
        document.getElementById('dialog-confirm').addEventListener('click', submitDialog);
        document.getElementById('dialog-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitDialog();
            }
        });

        document.getElementById('btn-unlock-hint').addEventListener('click', () => {
            const c = getCaseById(state.currentCaseId);
            const prog = ensureCaseProgress(c.id);
            if (prog.hintsUsed < (c.hints || []).length) {
                prog.hintsUsed++;
                savePersistedData();
                triggerFeedback('small', null, { sound: 'click' });
                document.getElementById('hint-counter').textContent = `${prog.hintsUsed}/${c.hints.length}`;
                renderHintsModal();
            }
        });

        document.getElementById('btn-reopen-inquiry').addEventListener('click', () => {
            const c = getCaseById(state.currentCaseId);
            const prog = ensureCaseProgress(c.id);
            prog.authority = 100;
            prog.reopenedCount = (prog.reopenedCount || 0) + 1;
            savePersistedData();
            renderAuthorityBar();
            renderActiveTab();
            popOverlay(true);
            updateTensionAudio();
            triggerFeedback('small', null, { sound: 'folder' });
            showToast('Inquérito reaberto pelo Conselho. Autoridade restaurada a 100%!');
        });

        document.getElementById('btn-confirm-custom-json').addEventListener('click', () => {
            const txt = document.getElementById('custom-case-textarea').value;
            if (handleCustomCaseImport(txt)) {
                document.getElementById('custom-case-textarea').value = '';
                popOverlay(false);
            }
        });

        backdrop.addEventListener('click', () => {
            popOverlay(false);
        });

        // Sound, Bus Mixer & Accessibility Settings
        applyPersistedAudioAndFeel();
        syncAudioSettingsUI();

        const btnSound = document.getElementById('btn-sound');
        btnSound.addEventListener('click', () => {
            const next = !AudioFX.isEnabled();
            persisted.profile.soundEnabled = next;
            AudioFX.setEnabled(next);
            savePersistedData();
            syncAudioSettingsUI();
            if (next) {
                AudioFX.unlock();
                AudioFX.playTypeClick();
            }
        });

        const btnAudioSettings = document.getElementById('btn-audio-settings');
        const audioPop = document.getElementById('audio-popover');

        btnAudioSettings.addEventListener('click', e => {
            e.stopPropagation();
            AudioFX.unlock();
            const willOpen = audioPop.hidden;
            audioPop.hidden = !willOpen;
            btnAudioSettings.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) {
                const first = getFocusableElements(audioPop)[0];
                if (first) first.focus();
            }
        });

        document.getElementById('btn-close-audio-pop').addEventListener('click', () => closeAudioPopover(true));

        document.addEventListener('click', e => {
            if (!audioPop.hidden && !audioPop.contains(e.target) && !btnAudioSettings.contains(e.target)) {
                closeAudioPopover(false);
            }
        });

        document.getElementById('sel-ambience-mode').addEventListener('change', e => {
            persisted.profile.ambienceMode = e.target.value;
            savePersistedData();
            AudioFX.unlock();
            AudioFX.setAmbienceMode(e.target.value);
            updateTensionAudio();
        });

        ['ambience', 'music', 'sfx', 'ui'].forEach(bus => {
            const range = document.getElementById(`range-bus-${bus}`);
            const valEl = document.getElementById(`val-bus-${bus}`);
            if (!range) return;
            range.addEventListener('input', e => {
                const pct = Number(e.target.value);
                const v = pct / 100;
                if (!persisted.profile.audioBuses) persisted.profile.audioBuses = {};
                persisted.profile.audioBuses[bus] = v;
                if (bus === 'ambience') persisted.profile.volume = v;
                if (valEl) valEl.textContent = `${pct}%`;
                savePersistedData();
                AudioFX.unlock();
                AudioFX.setBusVolume(bus, v);
            });
        });

        document.getElementById('sel-text-speed').addEventListener('change', e => {
            persisted.profile.textSpeed = e.target.value;
            savePersistedData();
        });

        document.getElementById('range-shake-intensity').addEventListener('input', e => {
            const pct = Number(e.target.value);
            persisted.profile.shakeIntensity = pct / 100;
            document.getElementById('val-shake-intensity').textContent = `${pct}%`;
            savePersistedData();
        });

        document.getElementById('chk-reduce-flashes').addEventListener('change', e => {
            persisted.profile.reduceFlashes = e.target.checked;
            savePersistedData();
        });

        // Global Keyboard Manager: Focus Trap + Escape + Shortcuts (never hijacks inputs)
        document.addEventListener('keydown', e => {
            const top = getTopOverlay();

            // Focus Trap inside active modal/drawer
            if (e.key === 'Tab' && top) {
                const focusables = getFocusableElements(top.el);
                if (focusables.length === 0) {
                    e.preventDefault();
                    return;
                }
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && (document.activeElement === first || !top.el.contains(document.activeElement))) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && (document.activeElement === last || !top.el.contains(document.activeElement))) {
                    e.preventDefault();
                    first.focus();
                }
                return;
            }

            if (e.key === 'Escape') {
                if (closeAudioPopover(true)) {
                    e.preventDefault();
                    return;
                }
                if (top) {
                    e.preventDefault();
                    popOverlay(false);
                    return;
                }
                if (state.view === 'case') {
                    e.preventDefault();
                    if (state.activeTab === 'corkboard' && state.corkboard.connectMode) {
                        state.corkboard.connectMode = false;
                        state.corkboard.pendingFrom = null;
                        renderActiveTab();
                        return;
                    }
                    state.view = 'home';
                    renderAll();
                }
                return;
            }

            // Undo/Redo in Corkboard
            if (!top && state.view === 'case' && state.activeTab === 'corkboard' && (e.ctrlKey || e.metaKey) && !isEditableTarget(e.target)) {
                const keyLow = e.key.toLowerCase();
                if (keyLow === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    performCorkUndo(document.getElementById('dossier-content'));
                    return;
                }
                if (keyLow === 'y' || (keyLow === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    performCorkRedo(document.getElementById('dossier-content'));
                    return;
                }
            }

            // Allow 'N' to close notebook drawer when focused on a non-editable control inside it
            if (top && top.el === notebookDrawer && !e.ctrlKey && !e.metaKey && !e.altKey && !isEditableTarget(e.target) && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                popOverlay(false);
                return;
            }

            // Skip single-key shortcuts if inside overlay, modifier held, or typing
            if (top || e.ctrlKey || e.metaKey || e.altKey || isEditableTarget(e.target)) return;

            if (e.key === '?') {
                e.preventDefault();
                pushOverlay(shortcutsModal);
                return;
            }

            const low = e.key.toLowerCase();
            if (low === 'n') {
                e.preventDefault();
                openNotebookDrawer();
                return;
            }

            if (state.view === 'case') {
                const tabKeys = { '1': 'scene', '2': 'suspects', '3': 'evidence', '4': 'corkboard', '5': 'timeline', '6': 'accuse' };
                if (tabKeys[e.key]) {
                    e.preventDefault();
                    switchCaseTab(tabKeys[e.key], false);
                } else if (low === 'c') {
                    e.preventDefault();
                    openComparator(state.comparator.left, state.comparator.right);
                } else if (low === 'h') {
                    e.preventDefault();
                    openHintModal();
                }
            }
        });
    }

    // Boot
    bindGlobalEvents();
    renderAll();
    if (bootNotices.length > 0) {
        showToast(bootNotices[0]);
    }
})(window);
