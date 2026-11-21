/**
 * Ecossistema Extensão Biotecnologia Vermelha (UFPA / ICB / FABIOTEC)
 * Componente universal de navegação entre páginas (Shadow DOM isolado).
 * Compatível com file:/// e HTTP/HTTPS sem dependências externas.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'biotec_ecosystem_visited_v1';

  const ECOSYSTEM_PAGES = [
    {
      id: 'index',
      file: 'index.html',
      code: 'HUB 00',
      title: 'Portal Principal',
      shortTitle: 'Portal UFPA',
      category: 'portal',
      categoryLabel: 'Plataforma Central',
      accent: '#FACC15',
      description:
        'Plataforma completa em 6 módulos: DNA, Diagnóstico de Doenças, Genética Forense, Missão Laboratório, Jogos e Casos Solucionados.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
    },
    {
      id: 'dna',
      file: 'dna.html',
      code: 'EXP 01',
      title: 'Dupla-Hélice B-DNA 3D',
      shortTitle: 'B-DNA 3D',
      category: '3d',
      categoryLabel: 'Visualizador 3D',
      accent: '#22D3EE',
      description:
        'Molécula B-DNA tridimensional interativa com modos Montada, Raio-X e Explodida, filtros por nucleotídeo e ligações de hidrogênio.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4c4 0 4 16 8 16s4-16 8-16"/><path d="M4 20c4 0 4-16 8-16s4 16 8 16"/><line x1="7" y1="8.5" x2="17" y2="8.5"/><line x1="7" y1="15.5" x2="17" y2="15.5"/></svg>',
    },
    {
      id: 'pcr',
      file: 'pcr.html',
      code: 'EXP 02',
      title: 'BioForense 3D — Lab PCR',
      shortTitle: 'Lab PCR 3D',
      category: '3d',
      categoryLabel: 'Laboratório 3D',
      accent: '#34D399',
      description:
        'Bancada forense 3D interativa com 5 estações: Coleta, Extração, Termociclador PCR, Eletroforese em Gel e Comparação STR.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6.5L5.2 18.2A2 2 0 0 0 7 21h10a2 2 0 0 0 1.8-2.8L14 9.5V3"/><path d="M7.5 15h9"/></svg>',
    },
    {
      id: 'banner',
      file: 'banner.html',
      code: 'EXP 03',
      title: 'Banner 3D Interativo',
      shortTitle: 'Banner 3D',
      category: '3d',
      categoryLabel: 'Exposição 3D',
      accent: '#F43F5E',
      description:
        'Pôster acadêmico roll-up da UFPA em 3D com introdução cinematográfica de DNA, foco por seção e controle de abertura da lona.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="15" rx="1.5"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>',
    },
    {
      id: 'folder',
      file: 'folder.html',
      code: 'EXP 04',
      title: 'Folder 3D Interativo',
      shortTitle: 'Folder 3D',
      category: '3d',
      categoryLabel: 'Material 3D',
      accent: '#4ADE80',
      description:
        'Folheto tridimensional dobrável frente e verso com controle contínuo de dobradura, giro 360° e personalização de artes.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14"/><path d="M15 6v14"/></svg>',
    },
    {
      id: 'mistery',
      file: 'mistery.html',
      code: 'EXP 05',
      title: 'Arquivo Confidencial',
      shortTitle: 'Investigação',
      category: 'interativo',
      categoryLabel: 'Jogo Investigativo',
      accent: '#F59E0B',
      description:
        'Jogo de investigação criminal com dossiês completos, interrogatórios, evidências forenses, linha do tempo e quadro de acusação.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
    },
    {
      id: 'natal',
      file: 'natal.html',
      code: 'EXP 06',
      title: 'Cena Natalina ASCII',
      shortTitle: 'Natal ASCII',
      category: 'interativo',
      categoryLabel: 'Arte Generativa',
      accent: '#60A5FA',
      description:
        'Experiência visual generativa em arte ASCII em tempo real com neve reativa ao cursor, árvore iluminada, chalé e trenó.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 16.5 14 18.2 21 12 17.2 5.8 21 7.5 14 2 9.5 9 9 12 2"/></svg>',
    },
  ];

  // Captura os atributos do <script> antes do carregamento assíncrono terminar
  const currentScript = document.currentScript;
  const SCRIPT_CONFIG = {
    page: currentScript ? currentScript.getAttribute('data-page') : null,
    theme: currentScript ? currentScript.getAttribute('data-theme') : 'dark',
    pos: currentScript ? currentScript.getAttribute('data-pos') : 'default',
    idleDim: currentScript ? currentScript.getAttribute('data-idle-dim') === 'true' : false,
  };

  function detectCurrentFile() {
    if (SCRIPT_CONFIG.page) return SCRIPT_CONFIG.page.toLowerCase();
    try {
      const path = (window.location.pathname || '').replace(/\\/g, '/');
      const segment = path.split('/').filter(Boolean).pop() || 'index.html';
      const lower = segment.toLowerCase();
      if (ECOSYSTEM_PAGES.some((p) => p.file === lower)) return lower;
    } catch (e) { }
    return 'index.html';
  }

  function loadVisited(currentFile) {
    let list = [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (e) { }
    if (currentFile && !list.includes(currentFile)) {
      list.push(currentFile);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) { }
    }
    return new Set(list);
  }

  function injectViewTransitionCSS() {
    if (document.getElementById('biotec-ecosystem-vt-style')) return;
    const style = document.createElement('style');
    style.id = 'biotec-ecosystem-vt-style';
    style.textContent = '@view-transition { navigation: auto; }';
    document.head.appendChild(style);
  }

  function buildPlacementCSS(pos) {
    switch (pos) {
      case 'banner':
        return `
          .eco-dock { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); right: 16px; }
          @media (max-width: 960px) { .eco-dock { bottom: calc(80px + env(safe-area-inset-bottom, 0px)); right: 10px; } }
        `;
      case 'dna':
        return `
          .eco-dock { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); left: 16px; }
          @media (max-width: 1279px) { .eco-dock { bottom: calc(134px + env(safe-area-inset-bottom, 0px)); left: 10px; } }
          @media (max-width: 639px) { .eco-dock { bottom: calc(108px + env(safe-area-inset-bottom, 0px)); left: 10px; } }
        `;
      case 'folder':
        return `
          .eco-dock { bottom: calc(20px + env(safe-area-inset-bottom, 0px)); right: 20px; }
          @media (max-width: 960px) { .eco-dock { bottom: calc(136px + env(safe-area-inset-bottom, 0px)); right: 10px; } }
        `;
      case 'pcr':
        return `
          .eco-dock { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); right: 16px; }
          @media (max-width: 768px) { .eco-dock { bottom: calc(10px + env(safe-area-inset-bottom, 0px)); right: 10px; } }
        `;
      case 'mistery':
        return `
          .eco-dock { bottom: calc(18px + env(safe-area-inset-bottom, 0px)); right: 18px; }
          @media (max-width: 639px) { .eco-dock { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); right: 12px; } }
        `;
      case 'natal':
        return `
          .eco-dock { bottom: calc(18px + env(safe-area-inset-bottom, 0px)); right: 18px; }
          @media (max-width: 639px) { .eco-dock { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); right: 12px; } }
        `;
      case 'index':
      default:
        return `
          .eco-dock { bottom: calc(18px + env(safe-area-inset-bottom, 0px)); right: 18px; }
          @media (max-width: 639px) { .eco-dock { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); right: 12px; } }
        `;
    }
  }

  class BiotecEcosystemNav extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._filter = 'all';
      this._onGlobalOpen = () => this.openHub();
      this._onKeyDown = (e) => {
        if (e.altKey && !e.ctrlKey && !e.metaKey) {
          const key = (e.key || '').toLowerCase();
          if (key === 'e') {
            e.preventDefault();
            this.toggleHub();
          } else if (key === 'h' && this._currentFile !== 'index.html') {
            e.preventDefault();
            window.location.href = './index.html';
          }
        }
      };
    }

    connectedCallback() {
      this._currentFile = this.getAttribute('data-page') || detectCurrentFile();
      this._theme = this.getAttribute('data-theme') || SCRIPT_CONFIG.theme || 'dark';
      this._pos = this.getAttribute('data-pos') || SCRIPT_CONFIG.pos || 'default';
      this._idleDim =
        this.getAttribute('data-idle-dim') === 'true' || SCRIPT_CONFIG.idleDim;
      this._visited = loadVisited(this._currentFile);

      this.render();
      this.bindEvents();
      window.addEventListener('biotec:open-ecosystem', this._onGlobalOpen);
      window.addEventListener('keydown', this._onKeyDown);
    }

    disconnectedCallback() {
      window.removeEventListener('biotec:open-ecosystem', this._onGlobalOpen);
      window.removeEventListener('keydown', this._onKeyDown);
    }

    getCurrentIndex() {
      const idx = ECOSYSTEM_PAGES.findIndex((p) => p.file === this._currentFile);
      return idx >= 0 ? idx : 0;
    }

    openHub() {
      const dlg = this.shadowRoot.getElementById('eco-dialog');
      if (!dlg || dlg.open) return;
      if (typeof dlg.showModal === 'function') {
        dlg.showModal();
      } else {
        dlg.setAttribute('open', '');
      }
      const closeBtn = this.shadowRoot.getElementById('eco-close');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    closeHub() {
      const dlg = this.shadowRoot.getElementById('eco-dialog');
      if (!dlg || !dlg.open) return;
      if (typeof dlg.close === 'function') {
        dlg.close();
      } else {
        dlg.removeAttribute('open');
      }
    }

    toggleHub() {
      const dlg = this.shadowRoot.getElementById('eco-dialog');
      if (dlg && dlg.open) this.closeHub();
      else this.openHub();
    }

    setFilter(cat) {
      this._filter = cat;
      const buttons = this.shadowRoot.querySelectorAll('[data-filter-cat]');
      buttons.forEach((btn) => {
        const active = btn.getAttribute('data-filter-cat') === cat;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      const cards = this.shadowRoot.querySelectorAll('[data-card-cat]');
      cards.forEach((card) => {
        const c = card.getAttribute('data-card-cat');
        card.hidden = cat !== 'all' && c !== cat;
      });
    }

    render() {
      const curIdx = this.getCurrentIndex();
      const current = ECOSYSTEM_PAGES[curIdx];
      const prev =
        ECOSYSTEM_PAGES[(curIdx - 1 + ECOSYSTEM_PAGES.length) % ECOSYSTEM_PAGES.length];
      const next = ECOSYSTEM_PAGES[(curIdx + 1) % ECOSYSTEM_PAGES.length];
      const isHome = current.file === 'index.html';
      const isLight = this._theme === 'light';
      const visitedCount = ECOSYSTEM_PAGES.filter((p) => this._visited.has(p.file)).length;

      const cardsHtml = ECOSYSTEM_PAGES.map((p) => {
        const isCurrent = p.file === this._currentFile;
        const isVisited = this._visited.has(p.file);
        return `
          <a
            href="./${p.file}"
            class="eco-card ${isCurrent ? 'is-current' : ''}"
            data-card-cat="${p.category}"
            style="--card-accent: ${p.accent};"
            ${isCurrent ? 'aria-current="page"' : ''}
          >
            <div class="eco-card-top">
              <div class="eco-card-icon" aria-hidden="true">${p.icon}</div>
              <div class="eco-card-badges">
                <span class="eco-code">${p.code}</span>
                <span class="eco-cat">${p.categoryLabel}</span>
              </div>
            </div>
            <div class="eco-card-title">${p.title}</div>
            <p class="eco-card-desc">${p.description}</p>
            <div class="eco-card-foot">
              <span class="eco-status ${isCurrent ? 'is-now' : isVisited ? 'is-seen' : ''}">
                ${isCurrent ? '● VOCÊ ESTÁ AQUI' : isVisited ? '✓ VISITADO' : 'EXPLORAR'}
              </span>
              <span class="eco-arrow">${isCurrent ? 'ATIVO' : 'ABRIR →'}</span>
            </div>
          </a>
        `;
      }).join('');

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            all: initial;
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            color-scheme: dark;
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          /* ===== FLOATING ECOSYSTEM DOCK ===== */
          .eco-dock {
            position: fixed;
            z-index: 2147483000;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px;
            border-radius: 999px;
            background: ${isLight ? 'rgba(255, 255, 255, 0.86)' : 'rgba(9, 10, 14, 0.84)'};
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid ${isLight ? 'rgba(36, 85, 38, 0.24)' : 'rgba(250, 204, 21, 0.34)'};
            box-shadow: ${isLight
          ? '0 10px 28px rgba(24, 58, 26, 0.18), inset 0 1px 0 rgba(255,255,255,0.85)'
          : '0 12px 32px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        };
            transition: opacity 0.25s ease, transform 0.2s ease, border-color 0.2s ease;
            ${this._idleDim ? 'opacity: 0.72;' : 'opacity: 1;'}
            pointer-events: auto;
            user-select: none;
          }

          .eco-dock:hover,
          .eco-dock:focus-within {
            opacity: 1;
            border-color: ${isLight ? 'rgba(36, 85, 38, 0.55)' : 'rgba(250, 204, 21, 0.75)'};
          }

          ${buildPlacementCSS(this._pos)}

          .eco-pill-btn {
            appearance: none;
            border: none;
            background: transparent;
            color: ${isLight ? '#1b411d' : '#f4f4f5'};
            font-family: inherit;
            font-size: 12px;
            font-weight: 600;
            line-height: 1;
            padding: 8px 12px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            text-decoration: none;
            white-space: nowrap;
            transition: background-color 0.18s ease, color 0.18s ease, transform 0.15s ease;
          }

          .eco-pill-btn:hover {
            background: ${isLight ? 'rgba(36, 85, 38, 0.12)' : 'rgba(255, 255, 255, 0.10)'};
          }

          .eco-pill-btn:active {
            transform: scale(0.97);
          }

          .eco-pill-btn:focus-visible {
            outline: 2px solid ${isLight ? '#245526' : '#facc15'};
            outline-offset: 2px;
          }

          .eco-pill-btn.is-primary {
            background: ${isLight ? '#245526' : '#facc15'};
            color: ${isLight ? '#ffffff' : '#09090b'};
            font-weight: 700;
          }

          .eco-pill-btn.is-primary:hover {
            background: ${isLight ? '#1b411d' : '#fde047'};
          }

          .eco-pill-btn svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }

          .eco-sep {
            width: 1px;
            height: 18px;
            background: ${isLight ? 'rgba(36, 85, 38, 0.18)' : 'rgba(255, 255, 255, 0.14)'};
          }

          .eco-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: ${current.accent};
            box-shadow: 0 0 8px ${current.accent};
            flex-shrink: 0;
          }

          .eco-count-chip {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 999px;
            background: ${isLight ? 'rgba(255,255,255,0.2)' : 'rgba(9, 9, 11, 0.2)'};
          }

          @media (max-width: 480px) {
            .eco-hide-xs { display: none; }
            .eco-pill-btn { padding: 8px 10px; font-size: 11px; }
          }

          /* ===== ECOSYSTEM HUB DIALOG (TOP-LAYER) ===== */
          dialog#eco-dialog {
            width: min(960px, calc(100vw - 20px));
            max-width: 960px;
            max-height: min(90dvh, 820px);
            margin: auto;
            padding: 0;
            border: 1px solid rgba(250, 204, 21, 0.35);
            border-radius: 16px;
            background: #09090b;
            color: #f4f4f5;
            box-shadow: 0 28px 80px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px) scale(0.985);
            transition:
              opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              display 0.22s allow-discrete,
              overlay 0.22s allow-discrete;
          }

          dialog#eco-dialog[open] {
            display: flex;
            flex-direction: column;
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          @starting-style {
            dialog#eco-dialog[open] {
              opacity: 0;
              transform: translateY(10px) scale(0.985);
            }
          }

          dialog#eco-dialog::backdrop {
            background: rgba(0, 0, 0, 0.78);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          .eco-hazard {
            height: 4px;
            width: 100%;
            flex-shrink: 0;
            background: repeating-linear-gradient(
              -45deg,
              #facc15 0px,
              #facc15 8px,
              #09090b 8px,
              #09090b 16px
            );
          }

          .eco-head {
            padding: 16px 20px;
            border-bottom: 1px solid #27272a;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: #050507;
            flex-shrink: 0;
          }

          .eco-head-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
          }

          .eco-ufpa-box {
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: #facc15;
            color: #000000;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-weight: 800;
            font-size: 12px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
          }

          .eco-eyebrow {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #facc15;
            margin-bottom: 2px;
          }

          .eco-title {
            font-size: 16px;
            font-weight: 700;
            color: #f4f4f5;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .eco-close {
            appearance: none;
            border: 1px solid #3f3f46;
            background: #18181b;
            color: #e4e4e7;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 700;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
            flex-shrink: 0;
          }

          .eco-close:hover {
            border-color: #facc15;
            color: #facc15;
            background: #09090b;
          }

          .eco-close:focus-visible {
            outline: 2px solid #facc15;
            outline-offset: 2px;
          }

          .eco-toolbar {
            padding: 12px 20px;
            border-bottom: 1px solid #1f1f24;
            background: #0b0b0f;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex-shrink: 0;
          }

          .eco-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .eco-filter-btn {
            appearance: none;
            border: 1px solid #27272a;
            background: #121216;
            color: #a1a1aa;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 600;
            padding: 6px 11px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .eco-filter-btn:hover {
            border-color: #52525b;
            color: #f4f4f5;
          }

          .eco-filter-btn.is-active {
            background: #facc15;
            border-color: #facc15;
            color: #000000;
            font-weight: 700;
          }

          .eco-cycle {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .eco-cycle-link {
            text-decoration: none;
            border: 1px solid #27272a;
            background: #121216;
            color: #e4e4e7;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: border-color 0.15s ease, color 0.15s ease;
          }

          .eco-cycle-link:hover {
            border-color: #facc15;
            color: #facc15;
          }

          .eco-body {
            padding: 16px 20px 20px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
            scrollbar-width: thin;
            scrollbar-color: #3f3f46 #09090b;
          }

          .eco-home-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 14px;
            margin-bottom: 14px;
            border-radius: 12px;
            background: linear-gradient(90deg, rgba(250, 204, 21, 0.14), rgba(244, 63, 94, 0.08));
            border: 1px solid rgba(250, 204, 21, 0.45);
            text-decoration: none;
            color: #f4f4f5;
            transition: border-color 0.18s ease, transform 0.15s ease;
          }

          .eco-home-banner:hover {
            border-color: #facc15;
            transform: translateY(-1px);
          }

          .eco-home-banner strong {
            display: block;
            font-size: 13px;
            color: #facc15;
          }

          .eco-home-banner span {
            font-size: 12px;
            color: #d4d4d8;
          }

          .eco-home-cta {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 700;
            background: #facc15;
            color: #000000;
            padding: 7px 12px;
            border-radius: 8px;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .eco-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(255px, 100%), 1fr));
            gap: 12px;
          }

          .eco-card {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 14px;
            border-radius: 12px;
            background: #111116;
            border: 1px solid #27272a;
            text-decoration: none;
            color: inherit;
            overflow: hidden;
            transition: border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
          }

          .eco-card[hidden] {
            display: none;
          }

          .eco-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--card-accent, #facc15);
            opacity: 0.7;
          }

          .eco-card:hover {
            border-color: var(--card-accent, #facc15);
            background: #15151c;
            transform: translateY(-2px);
          }

          .eco-card:focus-visible {
            outline: 2px solid var(--card-accent, #facc15);
            outline-offset: 2px;
          }

          .eco-card.is-current {
            border-color: var(--card-accent, #facc15);
            background: linear-gradient(180deg, rgba(250, 204, 21, 0.08), #111116 65%);
            box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.25);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--card-accent, #facc15) 35%, transparent);
          }

          .eco-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .eco-card-icon {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            display: grid;
            place-items: center;
            color: var(--card-accent, #facc15);
            background: rgba(255, 255, 255, 0.06);
            background: color-mix(in srgb, var(--card-accent, #facc15) 14%, #09090b);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border: 1px solid color-mix(in srgb, var(--card-accent, #facc15) 30%, transparent);
            flex-shrink: 0;
          }

          .eco-card-icon svg {
            width: 18px;
            height: 18px;
          }

          .eco-card-badges {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .eco-code {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            font-weight: 700;
            color: #a1a1aa;
            letter-spacing: 0.08em;
          }

          .eco-cat {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 999px;
            color: var(--card-accent, #facc15);
            background: rgba(255, 255, 255, 0.06);
            background: color-mix(in srgb, var(--card-accent, #facc15) 12%, transparent);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border: 1px solid color-mix(in srgb, var(--card-accent, #facc15) 28%, transparent);
          }

          .eco-card-title {
            font-size: 14px;
            font-weight: 700;
            color: #fafafa;
            line-height: 1.25;
          }

          .eco-card-desc {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            color: #a1a1aa;
            flex: 1;
          }

          .eco-card-foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 8px;
            margin-top: 2px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.06em;
          }

          .eco-status {
            color: #71717a;
          }

          .eco-status.is-now {
            color: var(--card-accent, #facc15);
          }

          .eco-status.is-seen {
            color: #34d399;
          }

          .eco-arrow {
            color: #e4e4e7;
          }

          .eco-card:hover .eco-arrow {
            color: var(--card-accent, #facc15);
          }

          .eco-foot {
            padding: 10px 20px;
            border-top: 1px solid #27272a;
            background: #050507;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            color: #71717a;
            flex-shrink: 0;
          }

          .eco-progress {
            color: #d4d4d8;
          }

          .eco-progress strong {
            color: #facc15;
          }

          kbd {
            font-family: inherit;
            padding: 1px 5px;
            border-radius: 4px;
            border: 1px solid #3f3f46;
            background: #18181b;
            color: #e4e4e7;
          }

          @media (max-width: 600px) {
            dialog#eco-dialog {
              width: calc(100vw - 14px);
              max-height: 92dvh;
              border-radius: 14px;
            }

            .eco-head {
              padding: 12px 14px;
            }

            .eco-ufpa-box {
              width: 32px;
              height: 32px;
              font-size: 11px;
            }

            .eco-title {
              font-size: 14px;
            }

            .eco-close {
              padding: 7px 10px;
              font-size: 10px;
            }

            .eco-toolbar {
              padding: 10px 14px;
              gap: 8px;
            }

            .eco-filters {
              width: 100%;
              flex-wrap: nowrap;
              overflow-x: auto;
              scrollbar-width: none;
              -webkit-overflow-scrolling: touch;
            }

            .eco-filters::-webkit-scrollbar {
              display: none;
            }

            .eco-filter-btn {
              flex-shrink: 0;
              white-space: nowrap;
            }

            .eco-cycle {
              width: 100%;
            }

            .eco-cycle-link {
              flex: 1;
              justify-content: center;
              font-size: 10px;
              padding: 6px 8px;
            }

            .eco-body {
              padding: 12px 14px 16px;
            }

            .eco-home-banner {
              flex-direction: column;
              align-items: flex-start;
              padding: 11px 12px;
            }

            .eco-home-cta {
              width: 100%;
              text-align: center;
            }

            .eco-foot {
              padding: 9px 14px;
              font-size: 9.5px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            dialog#eco-dialog,
            .eco-card,
            .eco-dock,
            .eco-pill-btn {
              transition: none !important;
            }
          }
        </style>

        <!-- Barra Flutuante Compacta do Ecossistema -->
        <nav class="eco-dock" aria-label="Navegação do Ecossistema Biotecnologia Vermelha">
          ${!isHome
          ? `
            <a
              href="./index.html"
              class="eco-pill-btn"
              title="Voltar ao Portal Principal (Alt+H)"
              data-testid="eco-back-home"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
              </svg>
              <span>Início</span>
            </a>
            <span class="eco-sep" aria-hidden="true"></span>
          `
          : ''
        }
          <button
            type="button"
            id="eco-open-btn"
            class="eco-pill-btn is-primary"
            title="Abrir Mapa do Ecossistema (Alt+E)"
            aria-haspopup="dialog"
            data-testid="eco-open-hub"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.2"/>
              <rect x="14" y="3" width="7" height="7" rx="1.2"/>
              <rect x="3" y="14" width="7" height="7" rx="1.2"/>
              <rect x="14" y="14" width="7" height="7" rx="1.2"/>
            </svg>
            <span>Ecossistema</span>
            <span class="eco-count-chip eco-hide-xs">${isHome ? '6 APPS' : `${curIdx}/${ECOSYSTEM_PAGES.length - 1}`}</span>
          </button>
        </nav>

        <!-- Modal Hub do Ecossistema (Top Layer) -->
        <dialog id="eco-dialog" aria-labelledby="eco-dialog-title">
          <div class="eco-hazard" aria-hidden="true"></div>

          <div class="eco-head">
            <div class="eco-head-brand">
              <div class="eco-ufpa-box" aria-hidden="true">UFPA</div>
              <div style="min-width:0;">
                <div class="eco-eyebrow">ECOSSISTEMA INTERATIVO • BIOTECNOLOGIA VERMELHA</div>
                <div id="eco-dialog-title" class="eco-title">
                  Mapa de Experiências — Atual: ${current.title}
                </div>
              </div>
            </div>
            <button type="button" id="eco-close" class="eco-close" aria-label="Fechar mapa do ecossistema">
              FECHAR [ESC]
            </button>
          </div>

          <div class="eco-toolbar">
            <div class="eco-filters" role="group" aria-label="Filtrar experiências do ecossistema">
              <button type="button" class="eco-filter-btn is-active" data-filter-cat="all" aria-pressed="true">
                Todos (7)
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="portal" aria-pressed="false">
                Portal (1)
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="3d" aria-pressed="false">
                Experiências 3D (4)
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="interativo" aria-pressed="false">
                Jogos &amp; Arte (2)
              </button>
            </div>

            <div class="eco-cycle" aria-label="Alternar entre páginas vizinhas">
              <a href="./${prev.file}" class="eco-cycle-link" title="Ir para ${prev.title}">
                ← ${prev.shortTitle}
              </a>
              <a href="./${next.file}" class="eco-cycle-link" title="Ir para ${next.title}">
                ${next.shortTitle} →
              </a>
            </div>
          </div>

          <div class="eco-body">
            ${!isHome
          ? `
              <a href="./index.html" class="eco-home-banner">
                <div>
                  <strong>← Voltar ao Portal Principal (index.html)</strong>
                  <span>Acesse os 6 módulos educacionais completos, caixinhas ilustradas, jogos e dossiês da extensão UFPA.</span>
                </div>
                <span class="eco-home-cta">IR AO PORTAL</span>
              </a>
            `
          : ''
        }

            <div class="eco-grid">
              ${cardsHtml}
            </div>
          </div>

          <div class="eco-foot">
            <div class="eco-progress">
              EXPLORAÇÃO DA SESSÃO: <strong>${visitedCount}/${ECOSYSTEM_PAGES.length}</strong> AMBIENTES VISITADOS
            </div>
            <div>
              Atalhos: <kbd>Alt</kbd>+<kbd>E</kbd> Ecossistema
              ${!isHome ? ' • <kbd>Alt</kbd>+<kbd>H</kbd> Início' : ''}
              • <kbd>Esc</kbd> Fechar
            </div>
          </div>
        </dialog>
      `;
    }

    bindEvents() {
      const openBtn = this.shadowRoot.getElementById('eco-open-btn');
      const closeBtn = this.shadowRoot.getElementById('eco-close');
      const dlg = this.shadowRoot.getElementById('eco-dialog');

      if (openBtn) {
        openBtn.addEventListener('click', () => this.openHub());
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeHub());
      }
      if (dlg) {
        dlg.addEventListener('click', (e) => {
          if (e.target === dlg) this.closeHub();
        });
      }

      this.shadowRoot.querySelectorAll('[data-filter-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.setFilter(btn.getAttribute('data-filter-cat'));
        });
      });
    }
  }

  if (!customElements.get('biotec-ecosystem-nav')) {
    customElements.define('biotec-ecosystem-nav', BiotecEcosystemNav);
  }

  function mount() {
    injectViewTransitionCSS();
    if (document.querySelector('biotec-ecosystem-nav')) return;
    const el = document.createElement('biotec-ecosystem-nav');
    if (SCRIPT_CONFIG.page) el.setAttribute('data-page', SCRIPT_CONFIG.page);
    if (SCRIPT_CONFIG.theme) el.setAttribute('data-theme', SCRIPT_CONFIG.theme);
    if (SCRIPT_CONFIG.pos) el.setAttribute('data-pos', SCRIPT_CONFIG.pos);
    if (SCRIPT_CONFIG.idleDim) el.setAttribute('data-idle-dim', 'true');
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
