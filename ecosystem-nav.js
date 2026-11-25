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
        'Molécula B-DNA tridimensional interativa com modos Montada e Explodida, filtros por nucleotídeo e ligações de hidrogênio.',
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
      accent: '#38BDF8',
      description:
        'Experiência visual generativa em arte ASCII em tempo real com neve reativa e vila natalina 2D — dizem que há algo suspeito com a estrela...',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 16.5 14 18.2 21 12 17.2 5.8 21 7.5 14 2 9.5 9 9 12 2"/></svg>',
    },
    {
      id: 'qeop',
      file: 'qeop.html',
      code: 'EXP 07',
      title: 'DNA Forense 3D — Mistérios Genéticos',
      shortTitle: 'Mistérios DNA',
      category: 'interativo',
      categoryLabel: 'Jogo Forense 3D',
      accent: '#C084FC',
      description:
        'Desvende 9 mistérios genéticos reais (STR autossômico, cromossomos X/Y, DNA felino e mtDNA de 12 bases) sobre cena 3D UV-violeta reativa.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v5l-4.5 9A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 8V3"/><circle cx="12" cy="14" r="2"/></svg>',
    },
    {
      id: 'dna-snake',
      file: 'dna-snake.html',
      code: 'EXP 08',
      title: 'DNA Snake — Síntese de Fita',
      shortTitle: 'DNA Snake',
      category: 'interativo',
      categoryLabel: 'Jogo Arcade DNA',
      accent: '#DB2777',
      description:
        'Jogo arcade biomolecular de síntese de fita 5′→3′: capture nucleotídeos livres (A, T, C, G) e encadeie pares complementares para multiplicar o combo.',
      icon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h9a3.5 3.5 0 0 0 0-7h-2a3.5 3.5 0 0 1 0-7h7"/><circle cx="19" cy="4" r="1.5" fill="currentColor"/><line x1="8" y1="14.5" x2="12" y2="14.5"/><line x1="12" y1="7.5" x2="16" y2="7.5"/></svg>',
    },
  ];

  const PAGE_THEMES = {
    'index.html': {
      colorScheme: 'dark',
      bg: 'rgba(9, 10, 14, 0.88)',
      border: 'rgba(250, 204, 21, 0.38)',
      borderHover: 'rgba(250, 204, 21, 0.78)',
      text: '#F4F4F5',
      textMuted: '#A1A1AA',
      sep: 'rgba(255, 255, 255, 0.14)',
      pillHover: 'rgba(255, 255, 255, 0.10)',
      accent: '#FACC15',
      accentHover: '#FDE047',
      accentContrast: '#09090B',
      accentSecondary: '#FACC15',
      chipBg: 'rgba(9, 9, 11, 0.22)',
      shadow: '0 12px 32px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      dialogBg: '#09090B',
      dialogSurface: '#111116',
      dialogSurfaceAlt: '#050507',
      dialogBorder: '#27272A',
      dialogText: '#F4F4F5',
      dialogMuted: '#A1A1AA',
      cardHover: '#15151C',
      seenColor: '#34D399',
    },
    'dna.html': {
      colorScheme: 'dark',
      bg: 'rgba(7, 13, 26, 0.86)',
      border: 'rgba(34, 211, 238, 0.38)',
      borderHover: 'rgba(103, 232, 249, 0.78)',
      text: '#E2E8F0',
      textMuted: '#94A3B8',
      sep: 'rgba(148, 163, 184, 0.20)',
      pillHover: 'rgba(34, 211, 238, 0.12)',
      accent: '#22D3EE',
      accentHover: '#67E8F9',
      accentContrast: '#04131D',
      accentSecondary: '#34D399',
      chipBg: 'rgba(4, 19, 29, 0.22)',
      shadow: '0 12px 32px rgba(2, 6, 23, 0.62), 0 0 0 1px rgba(34, 211, 238, 0.08) inset',
      dialogBg: '#070D1A',
      dialogSurface: '#0D172B',
      dialogSurfaceAlt: '#050A14',
      dialogBorder: '#1E3250',
      dialogText: '#F1F5F9',
      dialogMuted: '#94A3B8',
      cardHover: '#11203B',
      seenColor: '#34D399',
    },
    'pcr.html': {
      colorScheme: 'dark',
      bg: 'rgba(10, 17, 32, 0.86)',
      border: 'rgba(16, 185, 129, 0.40)',
      borderHover: 'rgba(52, 211, 153, 0.80)',
      text: '#F1F5F9',
      textMuted: '#94A3B8',
      sep: 'rgba(148, 163, 184, 0.20)',
      pillHover: 'rgba(16, 185, 129, 0.14)',
      accent: '#10B981',
      accentHover: '#34D399',
      accentContrast: '#021810',
      accentSecondary: '#22D3EE',
      chipBg: 'rgba(2, 24, 16, 0.22)',
      shadow: '0 12px 32px rgba(2, 8, 20, 0.62), 0 0 0 1px rgba(16, 185, 129, 0.08) inset',
      dialogBg: '#0A1120',
      dialogSurface: '#101B30',
      dialogSurfaceAlt: '#070D19',
      dialogBorder: '#1F3347',
      dialogText: '#F1F5F9',
      dialogMuted: '#94A3B8',
      cardHover: '#15243E',
      seenColor: '#34D399',
    },
    'banner.html': {
      colorScheme: 'dark',
      bg: 'rgba(15, 9, 13, 0.86)',
      border: 'rgba(244, 63, 94, 0.38)',
      borderHover: 'rgba(251, 113, 133, 0.80)',
      text: '#FFF1F2',
      textMuted: '#E2B4BE',
      sep: 'rgba(255, 210, 215, 0.18)',
      pillHover: 'rgba(244, 63, 94, 0.16)',
      accent: '#E11D48',
      accentHover: '#F43F5E',
      accentContrast: '#FFFFFF',
      accentSecondary: '#FB7185',
      chipBg: 'rgba(255, 255, 255, 0.20)',
      shadow: '0 12px 32px rgba(10, 2, 6, 0.65), 0 0 0 1px rgba(244, 63, 94, 0.08) inset',
      dialogBg: '#120A0E',
      dialogSurface: '#1B1016',
      dialogSurfaceAlt: '#0C0609',
      dialogBorder: '#3B1D28',
      dialogText: '#FFF1F2',
      dialogMuted: '#E2B4BE',
      cardHover: '#24141D',
      seenColor: '#34D399',
    },
    'folder.html': {
      colorScheme: 'light',
      bg: 'rgba(252, 254, 252, 0.88)',
      border: 'rgba(36, 85, 38, 0.28)',
      borderHover: 'rgba(36, 85, 38, 0.62)',
      text: '#143316',
      textMuted: '#2F5E32',
      sep: 'rgba(36, 85, 38, 0.18)',
      pillHover: 'rgba(36, 85, 38, 0.10)',
      accent: '#245526',
      accentHover: '#1B411D',
      accentContrast: '#FFFFFF',
      accentSecondary: '#245526',
      chipBg: 'rgba(255, 255, 255, 0.22)',
      shadow: '0 10px 28px rgba(24, 58, 26, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
      dialogBg: '#F7FBF7',
      dialogSurface: '#FFFFFF',
      dialogSurfaceAlt: '#EAF2EA',
      dialogBorder: '#C5DBC6',
      dialogText: '#143316',
      dialogMuted: '#2F5E32',
      cardHover: '#EFF6EF',
      seenColor: '#185C39',
    },
    'mistery.html': {
      colorScheme: 'dark',
      bg: 'rgba(26, 22, 18, 0.90)',
      border: 'rgba(201, 158, 50, 0.42)',
      borderHover: 'rgba(231, 200, 115, 0.82)',
      text: '#F3EAD8',
      textMuted: '#C8BAA2',
      sep: 'rgba(201, 158, 50, 0.22)',
      pillHover: 'rgba(201, 158, 50, 0.14)',
      accent: '#C99E32',
      accentHover: '#E7C873',
      accentContrast: '#120F0D',
      accentSecondary: '#E7C873',
      chipBg: 'rgba(18, 15, 13, 0.24)',
      shadow: '0 12px 32px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(201, 158, 50, 0.08) inset',
      dialogBg: '#1A1612',
      dialogSurface: '#211C17',
      dialogSurfaceAlt: '#120F0D',
      dialogBorder: '#463B30',
      dialogText: '#F3EAD8',
      dialogMuted: '#C8BAA2',
      cardHover: '#2B241E',
      seenColor: '#5ED493',
    },
    'natal.html': {
      colorScheme: 'dark',
      bg: 'rgba(6, 11, 20, 0.84)',
      border: 'rgba(56, 189, 248, 0.35)',
      borderHover: 'rgba(250, 204, 21, 0.65)',
      text: '#E2E8F0',
      textMuted: '#94A3B8',
      sep: 'rgba(148, 163, 184, 0.22)',
      pillHover: 'rgba(56, 189, 248, 0.14)',
      accent: '#38BDF8',
      accentHover: '#7DD3FC',
      accentContrast: '#04070D',
      accentSecondary: '#FACC15',
      chipBg: 'rgba(4, 7, 13, 0.24)',
      shadow: '0 12px 32px rgba(2, 6, 15, 0.62), 0 0 0 1px rgba(56, 189, 248, 0.08) inset',
      dialogBg: '#060B14',
      dialogSurface: '#0B1424',
      dialogSurfaceAlt: '#04070D',
      dialogBorder: '#1E3554',
      dialogText: '#E2E8F0',
      dialogMuted: '#94A3B8',
      cardHover: '#101D33',
      seenColor: '#34D399',
    },
    'qeop.html': {
      colorScheme: 'dark',
      bg: 'rgba(17, 9, 34, 0.90)',
      border: 'rgba(192, 132, 252, 0.40)',
      borderHover: 'rgba(232, 121, 249, 0.82)',
      text: '#F5F0FF',
      textMuted: '#D2C2EC',
      sep: 'rgba(196, 152, 255, 0.22)',
      pillHover: 'rgba(168, 85, 247, 0.18)',
      accent: '#C084FC',
      accentHover: '#E879F9',
      accentContrast: '#080410',
      accentSecondary: '#E879F9',
      chipBg: 'rgba(8, 4, 16, 0.26)',
      shadow: '0 12px 32px rgba(4, 1, 10, 0.68), 0 0 0 1px rgba(192, 132, 252, 0.10) inset',
      dialogBg: '#080410',
      dialogSurface: '#110922',
      dialogSurfaceAlt: '#0B0617',
      dialogBorder: '#36215E',
      dialogText: '#F5F0FF',
      dialogMuted: '#D2C2EC',
      cardHover: '#190E31',
      seenColor: '#5EEAD4',
    },
    'dna-snake.html': {
      colorScheme: 'light',
      bg: 'rgba(255, 251, 253, 0.90)',
      border: 'rgba(219, 39, 119, 0.30)',
      borderHover: 'rgba(219, 39, 119, 0.65)',
      text: '#4A152B',
      textMuted: '#7D3B56',
      sep: 'rgba(219, 39, 119, 0.18)',
      pillHover: 'rgba(219, 39, 119, 0.10)',
      accent: '#DB2777',
      accentHover: '#BE185D',
      accentContrast: '#FFFFFF',
      accentSecondary: '#DB2777',
      chipBg: 'rgba(255, 255, 255, 0.24)',
      shadow: '0 10px 28px rgba(131, 24, 67, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.88)',
      dialogBg: '#FFF5F8',
      dialogSurface: '#FFFFFF',
      dialogSurfaceAlt: '#FFF0F6',
      dialogBorder: '#F7C6DA',
      dialogText: '#4A152B',
      dialogMuted: '#7D3B56',
      cardHover: '#FFF0F6',
      seenColor: '#15803D',
      backdrop: 'rgba(74, 21, 43, 0.48)',
      cardFootBorder: 'rgba(219, 39, 119, 0.14)',
    },
  };

  function normalizePageFile(raw) {
    const lower = (raw || '').toLowerCase();
    if (lower === 'rvore_de_natal_3d_ascii.html') return 'natal.html';
    return lower;
  }

  // Captura os atributos do <script> antes do carregamento assíncrono terminar
  const currentScript = document.currentScript;
  const SCRIPT_CONFIG = {
    page: currentScript ? currentScript.getAttribute('data-page') : null,
    idleDim: currentScript ? currentScript.getAttribute('data-idle-dim') === 'true' : false,
  };

  function detectCurrentFile() {
    if (SCRIPT_CONFIG.page) {
      const normalized = normalizePageFile(SCRIPT_CONFIG.page);
      if (ECOSYSTEM_PAGES.some((p) => p.file === normalized)) return normalized;
    }
    try {
      const path = (window.location.pathname || '').replace(/\\/g, '/');
      const segment = path.split('/').filter(Boolean).pop() || 'index.html';
      const normalized = normalizePageFile(segment);
      if (ECOSYSTEM_PAGES.some((p) => p.file === normalized)) return normalized;
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

  function buildPlacementCSS() {
    return `
      .eco-dock {
        bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        right: calc(16px + env(safe-area-inset-right, 0px));
      }
      @media (max-width: 640px) {
        .eco-dock {
          bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          right: calc(12px + env(safe-area-inset-right, 0px));
        }
      }
    `;
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
      const attrPage = this.getAttribute('data-page');
      this._currentFile = attrPage ? normalizePageFile(attrPage) : detectCurrentFile();
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
      const theme = PAGE_THEMES[this._currentFile] || PAGE_THEMES['index.html'];
      const isLight = theme.colorScheme === 'light';
      const visitedCount = ECOSYSTEM_PAGES.filter((p) => this._visited.has(p.file)).length;

      const cardsHtml = ECOSYSTEM_PAGES.map((p) => {
        const isCurrent = p.file === this._currentFile;
        const isVisited = this._visited.has(p.file);
        const cardInk = isLight
          ? `color-mix(in srgb, ${p.accent} 45%, ${theme.dialogText})`
          : p.accent;
        return `
          <a
            href="./${p.file}"
            class="eco-card ${isCurrent ? 'is-current' : ''}"
            data-card-cat="${p.category}"
            style="--card-accent: ${p.accent}; --card-ink: ${cardInk};"
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
            color-scheme: ${theme.colorScheme};
            --eco-bg: ${theme.bg};
            --eco-border: ${theme.border};
            --eco-border-hover: ${theme.borderHover};
            --eco-text: ${theme.text};
            --eco-text-muted: ${theme.textMuted};
            --eco-sep: ${theme.sep};
            --eco-pill-hover: ${theme.pillHover};
            --eco-accent: ${theme.accent};
            --eco-accent-hover: ${theme.accentHover};
            --eco-accent-contrast: ${theme.accentContrast};
            --eco-accent-secondary: ${theme.accentSecondary};
            --eco-chip-bg: ${theme.chipBg};
            --eco-shadow: ${theme.shadow};
            --eco-dialog-bg: ${theme.dialogBg};
            --eco-dialog-surface: ${theme.dialogSurface};
            --eco-dialog-surface-alt: ${theme.dialogSurfaceAlt};
            --eco-dialog-border: ${theme.dialogBorder};
            --eco-dialog-text: ${theme.dialogText};
            --eco-dialog-muted: ${theme.dialogMuted};
            --eco-card-hover: ${theme.cardHover};
            --eco-seen-color: ${theme.seenColor};
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          /* ===== FLOATING ECOSYSTEM DOCK (INVARIANT CANONICAL POSITION) ===== */
          .eco-dock {
            position: fixed;
            z-index: 2147483000;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px;
            max-width: calc(100vw - 24px);
            border-radius: 999px;
            background: var(--eco-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--eco-border);
            box-shadow: var(--eco-shadow);
            transition: opacity 0.25s ease, transform 0.2s ease, border-color 0.2s ease;
            ${this._idleDim ? 'opacity: 0.76;' : 'opacity: 1;'}
            pointer-events: auto;
            user-select: none;
          }

          .eco-dock:hover,
          .eco-dock:focus-within {
            opacity: 1;
            border-color: var(--eco-border-hover);
          }

          ${buildPlacementCSS()}

          .eco-pill-btn {
            appearance: none;
            border: none;
            background: transparent;
            color: var(--eco-text);
            font-family: inherit;
            font-size: 12px;
            font-weight: 600;
            line-height: 1;
            min-height: 36px;
            padding: 8px 12px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            text-decoration: none;
            white-space: nowrap;
            transition: background-color 0.18s ease, color 0.18s ease, transform 0.15s ease;
          }

          .eco-pill-btn:hover {
            background: var(--eco-pill-hover);
          }

          .eco-pill-btn:active {
            transform: scale(0.97);
          }

          .eco-pill-btn:focus-visible {
            outline: 2px solid var(--eco-accent);
            outline-offset: 2px;
          }

          .eco-pill-btn.is-primary {
            background: var(--eco-accent);
            color: var(--eco-accent-contrast);
            font-weight: 700;
          }

          .eco-pill-btn.is-primary:hover {
            background: var(--eco-accent-hover);
          }

          .eco-pill-btn svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }

          .eco-sep {
            width: 1px;
            height: 18px;
            background: var(--eco-sep);
          }

          .eco-star-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--eco-accent-secondary);
            box-shadow: 0 0 8px var(--eco-accent-secondary);
            flex-shrink: 0;
          }

          .eco-count-chip {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 999px;
            background: var(--eco-chip-bg);
          }

          @media (max-width: 640px), (pointer: coarse) {
            .eco-pill-btn {
              min-height: 44px;
              padding: 0 12px;
            }
          }

          @media (max-width: 480px) {
            .eco-hide-xs { display: none; }
            .eco-pill-btn {
              padding: 0 11px;
              font-size: 11px;
              gap: 5px;
            }
          }

          /* ===== ECOSYSTEM HUB DIALOG (TOP-LAYER) ===== */
          dialog#eco-dialog {
            width: min(960px, calc(100vw - 20px));
            max-width: 960px;
            max-height: min(90dvh, 820px);
            margin: auto;
            padding: 0;
            border: 1px solid var(--eco-border);
            border-radius: 16px;
            background: var(--eco-dialog-bg);
            color: var(--eco-dialog-text);
            box-shadow: 0 28px 80px rgba(0, 0, 0, ${isLight ? '0.28' : '0.85'}), 0 0 0 1px ${isLight ? 'rgba(255,255,255,0.65)' : 'rgba(255, 255, 255, 0.06)'} inset;
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
            background: ${theme.backdrop || (isLight ? 'rgba(16, 36, 18, 0.52)' : 'rgba(0, 0, 0, 0.78)')};
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          .eco-hazard {
            height: 4px;
            width: 100%;
            flex-shrink: 0;
            background: repeating-linear-gradient(
              -45deg,
              var(--eco-accent-secondary) 0px,
              var(--eco-accent-secondary) 8px,
              var(--eco-dialog-surface-alt) 8px,
              var(--eco-dialog-surface-alt) 16px
            );
          }

          .eco-head {
            padding: 16px 20px;
            border-bottom: 1px solid var(--eco-dialog-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: var(--eco-dialog-surface-alt);
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
            background: var(--eco-accent);
            color: var(--eco-accent-contrast);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-weight: 800;
            font-size: 12px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--eco-accent-secondary) 40%, transparent);
          }

          .eco-eyebrow {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: ${isLight ? 'var(--eco-accent)' : 'var(--eco-accent-secondary)'};
            font-weight: 700;
            margin-bottom: 2px;
          }

          .eco-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--eco-dialog-text);
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .eco-close {
            appearance: none;
            border: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-surface);
            color: var(--eco-dialog-text);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 700;
            min-height: 36px;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
            flex-shrink: 0;
          }

          .eco-close:hover {
            border-color: var(--eco-accent);
            color: ${isLight ? 'var(--eco-accent)' : 'var(--eco-accent-hover)'};
            background: var(--eco-card-hover);
          }

          .eco-close:focus-visible {
            outline: 2px solid var(--eco-accent);
            outline-offset: 2px;
          }

          .eco-toolbar {
            padding: 12px 20px;
            border-bottom: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-bg);
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
            border: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-surface);
            color: var(--eco-dialog-muted);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 600;
            min-height: 34px;
            padding: 6px 11px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .eco-filter-btn:hover {
            border-color: var(--eco-border-hover);
            color: var(--eco-dialog-text);
          }

          .eco-filter-btn:focus-visible {
            outline: 2px solid var(--eco-accent);
            outline-offset: 2px;
          }

          .eco-filter-btn.is-active {
            background: var(--eco-accent);
            border-color: var(--eco-accent);
            color: var(--eco-accent-contrast);
            font-weight: 700;
          }

          .eco-cycle {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .eco-cycle-link {
            text-decoration: none;
            border: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-surface);
            color: var(--eco-dialog-text);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 600;
            min-height: 34px;
            padding: 6px 10px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
          }

          .eco-cycle-link:hover {
            border-color: var(--eco-accent);
            color: ${isLight ? 'var(--eco-accent)' : 'var(--eco-accent-hover)'};
            background: var(--eco-card-hover);
          }

          .eco-cycle-link:focus-visible {
            outline: 2px solid var(--eco-accent);
            outline-offset: 2px;
          }

          .eco-body {
            padding: 16px 20px 20px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
            scrollbar-width: thin;
            scrollbar-color: var(--eco-dialog-border) var(--eco-dialog-bg);
          }

          .eco-home-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 14px;
            margin-bottom: 14px;
            border-radius: 12px;
            background: color-mix(in srgb, var(--eco-accent) ${isLight ? '10%' : '14%'}, var(--eco-dialog-surface));
            border: 1px solid var(--eco-border);
            text-decoration: none;
            color: var(--eco-dialog-text);
            transition: border-color 0.18s ease, transform 0.15s ease;
          }

          .eco-home-banner:hover {
            border-color: var(--eco-accent);
            transform: translateY(-1px);
          }

          .eco-home-banner:focus-visible {
            outline: 2px solid var(--eco-accent);
            outline-offset: 2px;
          }

          .eco-home-banner strong {
            display: block;
            font-size: 13px;
            color: ${isLight ? 'var(--eco-accent)' : 'var(--eco-accent-hover)'};
          }

          .eco-home-banner span {
            font-size: 12px;
            color: var(--eco-dialog-muted);
          }

          .eco-home-cta {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 11px;
            font-weight: 700;
            background: var(--eco-accent);
            color: var(--eco-accent-contrast);
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
            background: var(--eco-dialog-surface);
            border: 1px solid var(--eco-dialog-border);
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
            background: var(--card-accent, var(--eco-accent));
            opacity: 0.78;
          }

          .eco-card:hover {
            border-color: var(--card-accent, var(--eco-accent));
            background: var(--eco-card-hover);
            transform: translateY(-2px);
          }

          .eco-card:focus-visible {
            outline: 2px solid var(--card-accent, var(--eco-accent));
            outline-offset: 2px;
          }

          .eco-card.is-current {
            border-color: var(--card-accent, var(--eco-accent));
            background: color-mix(in srgb, var(--card-accent, var(--eco-accent)) ${isLight ? '10%' : '11%'}, var(--eco-dialog-surface));
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--card-accent, var(--eco-accent)) 35%, transparent);
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
            color: var(--card-ink, var(--eco-accent));
            background: color-mix(in srgb, var(--card-accent, var(--eco-accent)) 14%, var(--eco-dialog-surface-alt));
            border: 1px solid color-mix(in srgb, var(--card-accent, var(--eco-accent)) 32%, transparent);
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
            color: var(--eco-dialog-muted);
            letter-spacing: 0.08em;
          }

          .eco-cat {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 999px;
            color: var(--card-ink, var(--eco-accent));
            background: color-mix(in srgb, var(--card-accent, var(--eco-accent)) ${isLight ? '16%' : '12%'}, transparent);
            border: 1px solid color-mix(in srgb, var(--card-accent, var(--eco-accent)) 30%, transparent);
          }

          .eco-card-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--eco-dialog-text);
            line-height: 1.25;
          }

          .eco-card-desc {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            color: var(--eco-dialog-muted);
            flex: 1;
          }

          .eco-card-foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 8px;
            margin-top: 2px;
            border-top: 1px solid ${theme.cardFootBorder || (isLight ? 'rgba(36, 85, 38, 0.12)' : 'rgba(255, 255, 255, 0.07)')};
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.06em;
          }

          .eco-status {
            color: var(--eco-dialog-muted);
          }

          .eco-status.is-now {
            color: var(--card-ink, var(--eco-accent));
          }

          .eco-status.is-seen {
            color: var(--eco-seen-color);
          }

          .eco-arrow {
            color: var(--eco-dialog-text);
          }

          .eco-card:hover .eco-arrow {
            color: var(--card-ink, var(--eco-accent));
          }

          .eco-foot {
            padding: 10px 20px;
            border-top: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-surface-alt);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 10px;
            color: var(--eco-dialog-muted);
            flex-shrink: 0;
          }

          .eco-progress {
            color: var(--eco-dialog-text);
          }

          .eco-progress strong {
            color: ${isLight ? 'var(--eco-accent)' : 'var(--eco-accent-secondary)'};
          }

          kbd {
            font-family: inherit;
            padding: 1px 5px;
            border-radius: 4px;
            border: 1px solid var(--eco-dialog-border);
            background: var(--eco-dialog-surface);
            color: var(--eco-dialog-text);
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
              min-height: 40px;
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
              min-height: 38px;
            }

            .eco-cycle {
              width: 100%;
            }

            .eco-cycle-link {
              flex: 1;
              justify-content: center;
              font-size: 10px;
              min-height: 38px;
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

        <!-- Barra Flutuante Compacta do Ecossistema (Posição Única Invariante) -->
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
            ${theme.accentSecondary !== theme.accent ? '<span class="eco-star-dot" aria-hidden="true"></span>' : ''}
            <span>Ecossistema</span>
            <span class="eco-count-chip eco-hide-xs">${isHome ? `${ECOSYSTEM_PAGES.length - 1} APPS` : `${curIdx}/${ECOSYSTEM_PAGES.length - 1}`}</span>
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
                Todos (${ECOSYSTEM_PAGES.length})
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="portal" aria-pressed="false">
                Portal (${ECOSYSTEM_PAGES.filter((p) => p.category === 'portal').length})
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="3d" aria-pressed="false">
                Experiências 3D (${ECOSYSTEM_PAGES.filter((p) => p.category === '3d').length})
              </button>
              <button type="button" class="eco-filter-btn" data-filter-cat="interativo" aria-pressed="false">
                Jogos &amp; Arte (${ECOSYSTEM_PAGES.filter((p) => p.category === 'interativo').length})
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
                  <strong>← Voltar ao Portal Principal</strong>
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
    if (SCRIPT_CONFIG.idleDim) el.setAttribute('data-idle-dim', 'true');
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
