/* ============================================================================
   ARQUIVO CONFIDENCIAL — Arte Vetorial Dinâmica & Sistema Unificado de Ícones
   Retratos noir com iluminação chiaroscuro e expressões em tempo real,
   ícones de evidências, sistema unificado de ícones de UI (zero emojis),
   medalhas de conquistas e distintivos de patente policial.
   ============================================================================ */
(function (global) {
    'use strict';

    let svgUidCounter = 0;
    function nextUid(prefix) {
        svgUidCounter += 1;
        return `${prefix}_${svgUidCounter}`;
    }

    function normalizeMood(mood) {
        if (mood === 'nervous' || mood === 'sweating' || mood === 'furious') return mood;
        return 'calm';
    }

    function getPortraitSVG(type, mood) {
        const m = normalizeMood(mood);
        const idBg = nextUid('bg');
        const idLamp = nextUid('lamp');
        const idSkin = nextUid('skin');
        const idShadow = nextUid('shd');
        const idClip = nextUid('clip');

        const haloMap = {
            furious: { c1: '#b82525', o1: '0.38', c2: '#1a1210' },
            sweating: { c1: '#4d90b5', o1: '0.30', c2: '#14191d' },
            nervous: { c1: '#c99e32', o1: '0.28', c2: '#1b1611' },
            calm: { c1: '#d9b56c', o1: '0.20', c2: '#1a1612' }
        };
        const halo = haloMap[m] || haloMap.calm;

        const skinBaseMap = {
            woman_scarf: m === 'sweating' ? ['#d4c2ae', '#ad957e'] : ['#e0c6a8', '#b89574'],
            man_glasses: m === 'sweating' ? ['#cfc0ad', '#a6917b'] : ['#dcc4a8', '#b39475'],
            woman_bun: m === 'sweating' ? ['#d6c7b4', '#b09b84'] : ['#e3ccb2', '#ba9b7c'],
            man_hat: m === 'sweating' ? ['#c4a78c', '#997a5e'] : ['#d1af8d', '#a37e5c'],
            man_suit: m === 'sweating' ? ['#d1ba9f', '#a78c70'] : ['#dec2a6', '#b39070'],
            woman_doctor: m === 'sweating' ? ['#d9c9b8', '#b39e88'] : ['#e6d1ba', '#bfa184'],
            man_uniform: m === 'sweating' ? ['#cfb9a3', '#a38971'] : ['#ddc2a8', '#b18f71'],
            man_beard: m === 'sweating' ? ['#cab097', '#9e8167'] : ['#d8ba9b', '#ab8767'],
            woman_elder: m === 'sweating' ? ['#dcc9b7', '#b49e8a'] : ['#e8d3bd', '#c2a68a'],
            woman_artist: m === 'sweating' ? ['#d5c1ad', '#ac947e'] : ['#e2c8ad', '#b89677'],
            man_keeper: m === 'sweating' ? ['#c5a98f', '#987b62'] : ['#d2b293', '#a38061'],
            mastermind_sahur: m === 'sweating' ? ['#bda690', '#8f7761'] : ['#cfb498', '#9c7e62']
        };
        const [skinLight, skinDark] = skinBaseMap[type] || ['#dcc4a8', '#b39475'];
        const skinFill = `url(#${idSkin})`;

        const shapes = {
            woman_scarf: {
                back: `<path d="M16 100 C18 73 33 65 50 65 C67 65 82 73 84 100 Z" fill="#461d1d"/>
                       <path d="M50 65 C67 65 82 73 84 100 L52 100 Z" fill="rgba(0,0,0,0.28)"/>
                       <path d="M34 66 Q50 83 66 66 L61 89 Q50 95 39 89 Z" fill="#982626"/>
                       <path d="M40 73 Q50 82 60 73" stroke="#be4040" stroke-width="1.2" fill="none" opacity="0.6"/>`,
                neck: `<rect x="44" y="58" width="12" height="12" rx="4" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="17.5" ry="21.5" fill="${skinFill}"/>`,
                hair: `<path d="M29 42 C27 16 73 16 71 42 C73 57 67 65 62 63 C64 42 62 27 50 27 C38 27 36 42 38 63 C33 65 27 57 29 42 Z" fill="#1d1512"/>
                       <path d="M34 26 Q44 21 53 24" stroke="#4a382e" stroke-width="1.3" fill="none" opacity="0.55"/>`,
                eyewear: '',
                eyeY: 42,
                mouthY: 53,
                mouthColor: '#7d2424',
                hasBeard: false
            },
            man_glasses: {
                back: `<path d="M14 100 C17 72 32 65 50 65 C68 65 83 72 86 100 Z" fill="#2a3037"/>
                       <path d="M50 65 C68 65 83 72 86 100 L52 100 Z" fill="rgba(0,0,0,0.3)"/>
                       <polygon points="41,66 50,84 59,66" fill="#ebe2cf"/>
                       <polygon points="48,68 52,68 51.5,90 48.5,90" fill="#8b2525"/>`,
                neck: `<rect x="44" y="58" width="12" height="11" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="16.8" ry="20.8" fill="${skinFill}"/>`,
                hair: `<path d="M32 36 C32 18 68 18 68 36 C63 28 37 28 32 36 Z" fill="#26211e"/>
                       <path d="M36 25 Q46 20 56 23" stroke="#534942" stroke-width="1.2" fill="none" opacity="0.5"/>`,
                eyewear: `<rect x="36.5" y="38" width="11.5" height="7.2" rx="2" fill="rgba(255,248,225,0.08)" stroke="#181411" stroke-width="1.8"/>
                          <rect x="52" y="38" width="11.5" height="7.2" rx="2" fill="rgba(255,248,225,0.05)" stroke="#181411" stroke-width="1.8"/>
                          <line x1="48" y1="41.2" x2="52" y2="41.2" stroke="#181411" stroke-width="1.8"/>
                          <line x1="38.5" y1="39.8" x2="41" y2="39.8" stroke="rgba(255,255,255,0.45)" stroke-width="0.9"/>`,
                eyeY: 41.5,
                mouthY: 53,
                mouthColor: '#42362d',
                hasBeard: false
            },
            woman_bun: {
                back: `<circle cx="50" cy="17" r="9.5" fill="#241c17"/>
                       <path d="M16 100 C18 73 33 65 50 65 C67 65 82 73 84 100 Z" fill="#353d37"/>
                       <path d="M50 65 C67 65 82 73 84 100 L52 100 Z" fill="rgba(0,0,0,0.28)"/>
                       <polygon points="41,66 50,79 59,66" fill="#ece2cc"/>`,
                neck: `<rect x="44.5" y="58" width="11" height="11" rx="4" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="43" rx="16.8" ry="20" fill="${skinFill}"/>`,
                hair: `<path d="M32 39 C32 20 68 20 68 39 C61 29 39 29 32 39 Z" fill="#241c17"/>
                       <path d="M37 26 Q46 22 55 24" stroke="#534237" stroke-width="1.1" fill="none" opacity="0.5"/>`,
                eyewear: '',
                eyeY: 43,
                mouthY: 53,
                mouthColor: '#5e3c36',
                hasBeard: false
            },
            man_hat: {
                back: `<path d="M13 100 C17 71 32 65 50 65 C68 65 83 71 87 100 Z" fill="#372c22"/>
                       <path d="M50 65 C68 65 83 71 87 100 L52 100 Z" fill="rgba(0,0,0,0.34)"/>
                       <path d="M36 66 L47 84 L50 75 L53 84 L64 66" fill="#241c15"/>`,
                neck: `<rect x="44" y="59" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="45" rx="17.5" ry="19.8" fill="${skinFill}"/>`,
                hair: `<ellipse cx="50" cy="30" rx="31" ry="6.2" fill="#191411"/>
                       <path d="M30 30 L35 12 L65 12 L70 30 Z" fill="#241d18"/>
                       <rect x="33" y="25" width="34" height="4" fill="#982525"/>
                       <path d="M33 32 C41 37 59 37 67 32 L66 30 L34 30 Z" fill="rgba(0,0,0,0.38)"/>`,
                eyewear: '',
                eyeY: 44,
                mouthY: 54,
                mouthColor: '#36281e',
                hasBeard: false
            },
            man_suit: {
                back: `<path d="M13 100 C17 70 32 64 50 64 C68 64 83 70 87 100 Z" fill="#1b212b"/>
                       <path d="M50 64 C68 64 83 70 87 100 L52 100 Z" fill="rgba(0,0,0,0.32)"/>
                       <polygon points="41,65 50,87 59,65" fill="#f0e8d8"/>
                       <polygon points="48,67 52,67 51.2,87 48.8,87" fill="#b68a24"/>`,
                neck: `<rect x="44" y="58" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="17.5" ry="20.8" fill="${skinFill}"/>`,
                hair: `<path d="M31 37 C31 17 69 17 69 37 C62 27 38 27 31 37 Z" fill="#67645f"/>
                       <path d="M36 24 Q48 19 59 23" stroke="#9d9991" stroke-width="1.3" fill="none" opacity="0.55"/>`,
                eyewear: '',
                eyeY: 42,
                mouthY: 53,
                mouthColor: '#47382e',
                hasBeard: false
            },
            woman_doctor: {
                back: `<path d="M15 100 C19 71 33 65 50 65 C67 65 81 71 85 100 Z" fill="#d5d1c6"/>
                       <path d="M50 65 C67 65 81 71 85 100 L52 100 Z" fill="rgba(0,0,0,0.18)"/>
                       <path d="M38 67 V88 M62 67 V88" stroke="#36414a" stroke-width="2.8" stroke-linecap="round"/>
                       <circle cx="62" cy="89" r="3" fill="#5e6d78"/>`,
                neck: `<rect x="44.5" y="58" width="11" height="10" rx="4" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="16.8" ry="20.8" fill="${skinFill}"/>`,
                hair: `<path d="M30 44 C29 17 71 17 70 44 C69 55 65 59 62 56 C63 38 60 27 50 27 C40 27 37 38 38 56 C35 59 31 55 30 44 Z" fill="#1b1715"/>
                       <path d="M35 25 Q45 20 55 23" stroke="#483f3a" stroke-width="1.2" fill="none" opacity="0.5"/>`,
                eyewear: '',
                eyeY: 42,
                mouthY: 53,
                mouthColor: '#753131',
                hasBeard: false
            },
            man_uniform: {
                back: `<path d="M15 100 C19 71 33 65 50 65 C67 65 81 71 85 100 Z" fill="#202c3d"/>
                       <path d="M50 65 C67 65 81 71 85 100 L52 100 Z" fill="rgba(0,0,0,0.3)"/>
                       <line x1="50" y1="67" x2="50" y2="100" stroke="#141c27" stroke-width="1.4"/>
                       <circle cx="44" cy="80" r="2.2" fill="#d4aa3b"/><circle cx="56" cy="80" r="2.2" fill="#d4aa3b"/>`,
                neck: `<rect x="44" y="58" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="44" rx="16" ry="19" fill="${skinFill}"/>`,
                hair: `<path d="M30 32 L70 32 L65 16 L35 16 Z" fill="#202c3d"/>
                       <rect x="30" y="29" width="40" height="4" fill="#d4aa3b"/>
                       <path d="M34 33 C42 36 58 36 66 33" stroke="rgba(0,0,0,0.45)" stroke-width="2" fill="none"/>`,
                eyewear: '',
                eyeY: 44,
                mouthY: 54,
                mouthColor: '#4d3d33',
                hasBeard: false
            },
            man_beard: {
                back: `<path d="M14 100 C17 71 32 65 50 65 C68 65 83 71 86 100 Z" fill="#352e27"/>
                       <path d="M50 65 C68 65 83 71 86 100 L52 100 Z" fill="rgba(0,0,0,0.3)"/>
                       <polygon points="43,66 50,78 57,66" fill="#241e19"/>`,
                neck: `<rect x="44" y="58" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="17" ry="20.8" fill="${skinFill}"/>`,
                hair: `<path d="M32 38 C31 17 69 17 68 38 C61 28 39 28 32 38 Z" fill="#2b2019"/>
                       <path d="M33.5 48 C34.5 63.5 65.5 63.5 66.5 48 C61 55 39 55 33.5 48 Z" fill="#2b2019"/>`,
                eyewear: '',
                eyeY: 42,
                mouthY: 52,
                mouthColor: '#7a5848',
                hasBeard: true
            },
            woman_elder: {
                back: `<path d="M16 100 C19 72 33 65 50 65 C67 65 81 72 84 100 Z" fill="#4b3748"/>
                       <path d="M50 65 C67 65 81 72 84 100 L52 100 Z" fill="rgba(0,0,0,0.28)"/>
                       <circle cx="43" cy="70" r="2.4" fill="#f5efe2"/><circle cx="50" cy="72.5" r="2.4" fill="#f5efe2"/><circle cx="57" cy="70" r="2.4" fill="#f5efe2"/>`,
                neck: `<rect x="44.5" y="58" width="11" height="10" rx="4" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="43" rx="16.8" ry="20" fill="${skinFill}"/>`,
                hair: `<path d="M29 42 C27 18 73 18 71 42 C66 29 34 29 29 42 Z" fill="#c7c3bc"/>
                       <path d="M35 25 Q47 21 58 24" stroke="#e8e4dc" stroke-width="1.3" fill="none" opacity="0.6"/>`,
                eyewear: `<circle cx="43" cy="43" r="5" fill="rgba(255,250,235,0.06)" stroke="#524638" stroke-width="1.4"/>
                          <circle cx="57" cy="43" r="5" fill="rgba(255,250,235,0.04)" stroke="#524638" stroke-width="1.4"/>
                          <line x1="48" y1="43" x2="52" y2="43" stroke="#524638" stroke-width="1.2"/>`,
                eyeY: 43,
                mouthY: 53,
                mouthColor: '#6b4b45',
                hasBeard: false
            },
            woman_artist: {
                back: `<path d="M16 100 C19 72 33 65 50 65 C67 65 81 72 84 100 Z" fill="#1e2430"/>
                       <path d="M50 65 C67 65 81 72 84 100 L52 100 Z" fill="rgba(0,0,0,0.3)"/>
                       <path d="M39 66 Q50 76 61 66" stroke="#c99e32" stroke-width="2" fill="none"/>`,
                neck: `<rect x="44.5" y="58" width="11" height="10" rx="4" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="42" rx="16.5" ry="20.5" fill="${skinFill}"/>`,
                hair: `<path d="M29 45 C28 16 72 16 71 46 C71 60 66 67 62 65 C63 44 61 28 50 28 C39 28 37 44 38 65 C34 67 29 60 29 45 Z" fill="#3a1e16"/>
                       <path d="M35 24 Q45 20 55 24" stroke="#6c3c2d" stroke-width="1.3" fill="none" opacity="0.6"/>`,
                eyewear: '',
                eyeY: 42,
                mouthY: 53,
                mouthColor: '#822c2c',
                hasBeard: false
            },
            man_keeper: {
                back: `<path d="M13 100 C17 70 32 64 50 64 C68 64 83 70 87 100 Z" fill="#233238"/>
                       <path d="M50 64 C68 64 83 70 87 100 L52 100 Z" fill="rgba(0,0,0,0.34)"/>
                       <path d="M35 67 Q50 78 65 67 L63 79 Q50 86 37 79 Z" fill="#3b4d54"/>`,
                neck: `<rect x="44" y="58" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="43" rx="17" ry="20" fill="${skinFill}"/>`,
                hair: `<path d="M32 34 C34 19 66 19 68 34 Z" fill="#1e2b30"/>
                       <rect x="31" y="30" width="38" height="4.5" rx="2" fill="#2c3d44"/>
                       <path d="M35 50 C37 62 63 62 65 50 C59 55 41 55 35 50 Z" fill="#4f4842"/>`,
                eyewear: '',
                eyeY: 43,
                mouthY: 52.5,
                mouthColor: '#6d5044',
                hasBeard: true
            },
            mastermind_sahur: {
                back: `<path d="M10 100 C15 68 30 62 50 62 C70 62 85 68 90 100 Z" fill="#14110f" stroke="#c99e32" stroke-width="0.9"/>
                       <path d="M50 62 C70 62 85 68 90 100 L52 100 Z" fill="rgba(0,0,0,0.35)"/>
                       <path d="M33 65 L44 92 L50 76 L56 92 L67 65 Z" fill="#2a1616"/>
                       <polygon points="48,68 52,68 51,88 49,88" fill="#c99e32"/>`,
                neck: `<rect x="44" y="59" width="12" height="10" rx="3" fill="${skinDark}"/>`,
                head: `<ellipse cx="50" cy="44" rx="17" ry="20.5" fill="${skinFill}"/>`,
                hair: `<ellipse cx="50" cy="30" rx="33" ry="6.8" fill="#0d0b0a" stroke="#59462a" stroke-width="0.8"/>
                       <path d="M29 30 L34 11 L66 11 L71 30 Z" fill="#15110e"/>
                       <rect x="32" y="25" width="36" height="3.5" fill="#c99e32"/>
                       <path d="M34 33 C40 38 60 38 66 33 L65 30 L35 30 Z" fill="rgba(0,0,0,0.52)"/>`,
                eyewear: '',
                eyeY: 43,
                mouthY: 54,
                mouthColor: '#3a221c',
                hasBeard: false,
                goldEyes: true
            }
        };

        const c = shapes[type] || shapes.man_glasses;
        const ey = c.eyeY;
        const my = c.mouthY;
        const nose = `<path d="M50 ${ey + 1} L48.5 ${ey + 6.5} Q50 ${ey + 7.5} 51.8 ${ey + 6.5}" stroke="rgba(45,28,18,0.32)" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;

        let cheeks = '';
        let brows = '';
        let eyes = '';
        let mouth = '';
        let sweat = '';

        const eyeColor = c.goldEyes ? '#e6b842' : '#1c1512';

        if (m === 'calm') {
            brows = `<path d="M38.5 ${ey - 5.5} Q43 ${ey - 7} 47 ${ey - 5.5}" stroke="#241a14" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                     <path d="M53 ${ey - 5.5} Q57 ${ey - 7} 61.5 ${ey - 5.5}" stroke="#241a14" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
            eyes = `<ellipse cx="43" cy="${ey}" rx="2.7" ry="1.9" fill="#f7f1e6" opacity="0.82"/>
                    <ellipse cx="57" cy="${ey}" rx="2.7" ry="1.9" fill="#f7f1e6" opacity="0.82"/>
                    <circle cx="43" cy="${ey}" r="1.75" fill="${eyeColor}"/>
                    <circle cx="57" cy="${ey}" r="1.75" fill="${eyeColor}"/>
                    <circle cx="42.3" cy="${ey - 0.6}" r="0.55" fill="#fff"/>
                    <circle cx="56.3" cy="${ey - 0.6}" r="0.55" fill="#fff"/>`;
            mouth = c.hasBeard
                ? `<path d="M46 ${my} Q50 ${my + 1.4} 54 ${my}" stroke="${c.mouthColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
                : `<path d="M44.5 ${my} Q50 ${my + 1.8} 55.5 ${my}" stroke="${c.mouthColor}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
        } else if (m === 'nervous') {
            brows = `<path d="M37.5 ${ey - 4.2} Q42.5 ${ey - 7.8} 47.5 ${ey - 7.4}" stroke="#241a14" stroke-width="1.65" fill="none" stroke-linecap="round"/>
                     <path d="M52.5 ${ey - 7.4} Q57.5 ${ey - 7.8} 62.5 ${ey - 4.2}" stroke="#241a14" stroke-width="1.65" fill="none" stroke-linecap="round"/>`;
            eyes = `<ellipse cx="43" cy="${ey}" rx="3.4" ry="2.7" fill="#fffaf0"/>
                    <ellipse cx="57" cy="${ey}" rx="3.4" ry="2.7" fill="#fffaf0"/>
                    <circle cx="44.2" cy="${ey + 0.2}" r="1.6" fill="${eyeColor}"/>
                    <circle cx="58.2" cy="${ey + 0.2}" r="1.6" fill="${eyeColor}"/>
                    <circle cx="43.5" cy="${ey - 0.5}" r="0.55" fill="#fff"/>
                    <circle cx="57.5" cy="${ey - 0.5}" r="0.55" fill="#fff"/>`;
            mouth = `<path d="M44 ${my + 1} Q47 ${my - 1.2} 50 ${my + 1} T56 ${my + 0.8}" stroke="${c.mouthColor}" stroke-width="1.85" fill="none" stroke-linecap="round"/>`;
            sweat = `<path class="sweat-drop" d="M64 34 C66 37 66.5 40 64 41.2 C61.5 40 62 37 64 34 Z" fill="#8ad4f7" opacity="0.92"/>`;
        } else if (m === 'sweating') {
            brows = `<path d="M37.5 ${ey - 6} Q42.5 ${ey - 9.4} 47.5 ${ey - 6.8}" stroke="#241a14" stroke-width="1.7" fill="none" stroke-linecap="round"/>
                     <path d="M52.5 ${ey - 6.8} Q57.5 ${ey - 9.4} 62.5 ${ey - 6}" stroke="#241a14" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
            eyes = `<circle cx="43" cy="${ey}" r="3.6" fill="#ffffff" stroke="#2a211b" stroke-width="0.65"/>
                    <circle cx="57" cy="${ey}" r="3.6" fill="#ffffff" stroke="#2a211b" stroke-width="0.65"/>
                    <circle cx="43" cy="${ey + 0.3}" r="1.3" fill="${eyeColor}"/>
                    <circle cx="57" cy="${ey + 0.3}" r="1.3" fill="${eyeColor}"/>`;
            mouth = `<ellipse cx="50" cy="${my + 1}" rx="4.6" ry="2.5" fill="#2a1614" stroke="${c.mouthColor}" stroke-width="1.1"/>
                     <path d="M47 ${my + 0.2} H53" stroke="#efe5d5" stroke-width="0.9" opacity="0.7"/>`;
            sweat = `<path class="sweat-drop" d="M65 33 C67 37 67.5 40.5 65 42 C62.5 40.5 63 37 65 33 Z" fill="#7bd3ff"/>
                     <path class="sweat-drop" d="M35 37 C36.5 40 37 42.5 35 43.8 C33 42.5 33.5 40 35 37 Z" fill="#7bd3ff" opacity="0.88"/>
                     <circle cx="62" cy="48.5" r="1.4" fill="#7bd3ff" opacity="0.82"/>`;
        } else if (m === 'furious') {
            cheeks = `<ellipse cx="38" cy="${ey + 6}" rx="4.8" ry="2.8" fill="rgba(190,38,38,0.34)"/>
                      <ellipse cx="62" cy="${ey + 6}" rx="4.8" ry="2.8" fill="rgba(190,38,38,0.34)"/>`;
            brows = `<path d="M37.5 ${ey - 7.2} L47.5 ${ey - 3.4}" stroke="#1c110d" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                     <path d="M52.5 ${ey - 3.4} L62.5 ${ey - 7.2}" stroke="#1c110d" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
            eyes = `<path d="M38.5 ${ey - 0.6} Q43 ${ey + 1.8} 47.5 ${ey - 0.6}" stroke="#1e1714" stroke-width="1.2" fill="#fff3e8"/>
                    <path d="M52.5 ${ey - 0.6} Q57 ${ey + 1.8} 61.5 ${ey - 0.6}" stroke="#1e1714" stroke-width="1.2" fill="#fff3e8"/>
                    <circle cx="43" cy="${ey}" r="1.85" fill="${c.goldEyes ? '#ff4f4f' : '#1e1714'}"/>
                    <circle cx="57" cy="${ey}" r="1.85" fill="${c.goldEyes ? '#ff4f4f' : '#1e1714'}"/>`;
            mouth = `<rect x="43.5" y="${my - 1.2}" width="13" height="4" rx="1.4" fill="#f2ebe1" stroke="${c.mouthColor}" stroke-width="1.4"/>
                     <line x1="44" y1="${my + 0.8}" x2="56" y2="${my + 0.8}" stroke="#6b564e" stroke-width="0.9"/>`;
        }

        // Subtle noir Venetian blinds + side lamp chiaroscuro shadow across right cheek
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Retrato (${m})">
            <defs>
                <linearGradient id="${idBg}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#29221c"/>
                    <stop offset="100%" stop-color="${halo.c2}"/>
                </linearGradient>
                <radialGradient id="${idLamp}" cx="28%" cy="24%" r="65%">
                    <stop offset="0%" stop-color="${halo.c1}" stop-opacity="${halo.o1}"/>
                    <stop offset="100%" stop-color="${halo.c1}" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="${idSkin}" x1="0.15" y1="0.1" x2="0.9" y2="0.9">
                    <stop offset="0%" stop-color="${skinLight}"/>
                    <stop offset="68%" stop-color="${skinLight}"/>
                    <stop offset="100%" stop-color="${skinDark}"/>
                </linearGradient>
                <linearGradient id="${idShadow}" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="rgba(255,228,170,0.08)"/>
                    <stop offset="55%" stop-color="rgba(0,0,0,0)"/>
                    <stop offset="100%" stop-color="rgba(0,0,0,0.38)"/>
                </linearGradient>
                <clipPath id="${idClip}"><rect width="100" height="100"/></clipPath>
            </defs>
            <g clip-path="url(#${idClip})">
                <rect width="100" height="100" fill="url(#${idBg})"/>
                <rect width="100" height="100" fill="url(#${idLamp})"/>
                <g opacity="0.13" fill="#090705">
                    <polygon points="0,8 100,0 100,6 0,14"/>
                    <polygon points="0,24 100,16 100,22 0,30"/>
                    <polygon points="0,40 100,32 100,38 0,46"/>
                    <polygon points="0,56 100,48 100,54 0,62"/>
                </g>
                ${c.back}
                ${c.neck || ''}
                ${c.head}
                ${cheeks}
                ${nose}
                ${c.hair}
                ${eyes}
                ${brows}
                ${c.eyewear}
                ${mouth}
                ${sweat}
                <rect width="100" height="100" fill="url(#${idShadow})" pointer-events="none"/>
                <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="rgba(255,235,190,0.12)" stroke-width="1"/>
            </g>
        </svg>`;
    }

    function getEvidenceIconSVG(type) {
        const icons = {
            forensic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M8 15h8"/></svg>`,
            receipt: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3v18l3-2 2 2 2-2 2 2 2-2 3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>`,
            object: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
            log: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M7 17h4"/></svg>`,
            message: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v12H7l-3 3V4z"/><path d="M8 8h8M8 12h5"/></svg>`,
            photo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>`,
            audio: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
            cipher: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1"/></svg>`
        };
        return icons[type] || icons.object;
    }

    function getUIIconSVG(name, size) {
        const s = size || 15;
        const paths = {
            arrow_right: `<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`,
            arrow_left: `<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>`,
            chevron_up: `<path d="m18 15-6-6-6 6"/>`,
            chevron_down: `<path d="m6 9 6 6 6-6"/>`,
            chevron_right: `<path d="m9 18 6-6-6-6"/>`,
            check: `<path d="M20 6 9 17l-5-5"/>`,
            close: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
            lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
            unlock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/>`,
            alert: `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
            sliders: `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`,
            sound_on: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>`,
            sound_off: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`,
            compare: `<rect x="3" y="4" width="7" height="16" rx="1.2"/><rect x="14" y="4" width="7" height="16" rx="1.2"/>`,
            swap: `<path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>`,
            pin: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
            dot: `<circle cx="12" cy="12" r="4" fill="currentColor"/>`,
            undo: `<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>`,
            redo: `<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>`,
            zoom_in: `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>`,
            zoom_out: `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>`,
            fit: `<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>`,
            link: `<path d="M10 13a5 5 0 0 0 7.5.5l2.5-2.5a5 5 0 0 0-7.1-7.1l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5L4 13a5 5 0 0 0 7.1 7.1l1.5-1.5"/>`,
            backspace: `<path d="M21 5H8l-7 7 7 7h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>`,
            star: `<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>`,
            medal: `<circle cx="12" cy="15" r="6"/><path d="M8.5 9.5 6 3h4l2 5 2-5h4l-2.5 6.5"/>`,
            scales: `<path d="m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="m2 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>`,
            clock: `<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>`,
            notebook: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>`,
            keyboard: `<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h.01M12 13h.01M16 13h.01M7 16h10"/>`,
            history: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><polyline points="12 7 12 12 15 14"/>`,
            folder: `<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
            edit: `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>`,
            trash: `<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
            refresh: `<path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/>`,
            move: `<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>`
        };
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.dot}</svg>`;
    }

    function getMedalSVG(iconType, unlocked) {
        const stroke = unlocked ? '#e4c56c' : '#857766';
        const fill = unlocked ? 'rgba(201,158,50,0.2)' : 'rgba(60,52,44,0.22)';
        const inner = {
            first_blood: `<circle cx="12" cy="12" r="7"/><path d="m9.5 12 2 2 3.5-4"/>`,
            no_hints: `<path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="4"/>`,
            straight_to_point: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>`,
            lone_wolf: `<path d="M12 3 5 8v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V8l-7-5z"/><path d="m9 11 3 3 3-3"/>`,
            iron_badge: `<path d="M12 2 4 6v6c0 5 3.4 9.2 8 10 4.6-.8 8-5 8-10V6l-8-4z"/><path d="M12 8v8M8 12h8"/>`,
            red_string_master: `<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7 7.5 10.5 16M17 7.5 13.5 16M7.5 6h9"/>`,
            locksmith: `<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
            split_vision: `<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>`,
            wrong_turn: `<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>`,
            sahur_fall: `<rect x="7" y="4" width="10" height="15" rx="2"/><path d="M7 9h10M7 14h10"/><path d="m4 20 16-16"/>`,
            grand_detective: `<polygon points="12 2 15 8.5 22 9.5 17 14.5 18.2 21.5 12 18 5.8 21.5 7 14.5 2 9.5 9 8.5 12 2"/>`,
            community_sleuth: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/>`,
            parallel_sleuth: `<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="m9 14 2 2 4-4"/>`,
            cold_case_closer: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M16 3l3 3"/>`,
            thorough_investigator: `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/><path d="m8.5 11 1.8 1.8 3.2-3.6"/>`
        };
        return `<svg width="26" height="26" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner[iconType] || inner.first_blood}</svg>`;
    }

    function getBadgeSVG(tierIndex) {
        const palettes = [
            { rim: '#9a8060', body: '#362b20', star: '#d1b58d' },
            { rim: '#b4aaa0', body: '#2c3036', star: '#eae3d7' },
            { rim: '#d1a63a', body: '#3a2a12', star: '#f7d574' },
            { rim: '#e4c56c', body: '#4a1b1b', star: '#ffe89e' },
            { rim: '#ffd966', body: '#1f1612', star: '#ffcf48' }
        ];
        const p = palettes[Math.max(0, Math.min(palettes.length - 1, tierIndex || 0))];
        return `<svg width="52" height="52" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M32 4 L54 13 V31 C54 46 44 56 32 60 C20 56 10 46 10 31 V13 Z" fill="${p.body}" stroke="${p.rim}" stroke-width="3"/>
            <path d="M32 10 L48 17 V31 C48 42 40 50 32 54 C24 50 16 42 16 31 V17 Z" fill="none" stroke="${p.rim}" stroke-width="1.2" opacity="0.65"/>
            <polygon points="32,18 35.8,26.5 45,27.5 38,33.8 40,43 32,38.2 24,43 26,33.8 19,27.5 28.2,26.5" fill="${p.star}"/>
        </svg>`;
    }

    global.MisteryArt = {
        getPortraitSVG,
        getEvidenceIconSVG,
        getUIIconSVG,
        getMedalSVG,
        getBadgeSVG
    };
})(window);
