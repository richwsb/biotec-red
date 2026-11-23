# QEOP-DESIGN.md — DNA Forense 3D: Mistérios Genéticos

> Contrato visual, tipográfico, interativo, tridimensional, sonoro e de acessibilidade do jogo educacional **DNA Forense 3D — Mistérios Genéticos** (`qeop.html`), integrante oficial do ecossistema **Extensão Biotecnologia Vermelha (UFPA / ICB / FABIOTEC)**.
> **Escopo:** exclusivo de `qeop.html`. Não substitui `DESIGN.md` (portal principal e mapa do ecossistema) nem `MISTERY-DESIGN.md` (jogo noir `mistery.html`).

---

## 1. Visual Theme & Atmosphere

**Identidade Autoral:** **Laboratório de Espectroscopia UV & Eletroforese Forense (UV-Violeta)**
- Preserva a assinatura cromática violácea/lavanda que diferencia `qeop.html` dos outros 7 ambientes do ecossistema UFPA, eliminando o aspecto genérico de "glassmorphism roxo uniforme sobre tudo".
- **Superfícies tonais com profundidade real:** fundo abissal de espectroscopia (`#080410`), bancada de leitura sólida (`#110922`), bandejas de amostra (`#190e31`) e trilhas de gel (`#0b0617`) separadas por hairlines nítidas de `1px` e sombras com deslocamento real.

**Modo de Superfície (`impeccable`):** **Operate + Experience**
- **Operate (clareza pericial):** comparar alelos STR em barras proporcionais e alinhar sequências de 12 bases (`A/T/C/G`) exige contraste rigoroso, tipografia tabular e zero ruído decorativo competindo com os dados moleculares.
- **Experience (atmosfera laboratorial):** a dupla-hélice 3D em Three.js r128 reage ao tipo de marcador do caso atual (`Autossômico`, `Cromossomo Y`, `Cromossomo X`, `mtDNA`, `Felino`) e às ações investigativas do jogador em tiers graduados.

---

## 2. Color Palette & Semantic Roles (WCAG 2.2 AA)

Todos os pares texto/superfície atendem ou superam **4.5:1** para texto normal e **3:1** para texto grande e componentes de UI. Textos secundários são tingidos pela família lavanda (nunca cinza frio genérico).

### Superfícies & Estrutura
| Token CSS | Hex / Valor | Papel Semântico | Contraste com Texto Primário |
|---|---|---|---|
| `--bg-abyss` | `#080410` | Fundo abissal de espectroscopia / canvas base | `#f5f0ff` → ~18.5:1 |
| `--surface-bench` | `#110922` | Painel principal do caso e modais (sólido de alta legibilidade) | `#f5f0ff` → ~16.8:1 |
| `--surface-tray` | `#190e31` | Bandejas de amostras, cartões de indivíduo, controles secundários | `#f5f0ff` → ~14.7:1 |
| `--surface-gel` | `#0b0617` | Trilha rebaixada de eletroforese STR e grade de bases 12-mer | `#f5f0ff` → ~17.6:1 |
| `--surface-hover` | `#241446` | Estado hover/ativo em superfícies interativas | `#f5f0ff` → ~12.4:1 |
| `--hairline` | `rgba(196, 152, 255, 0.22)` | Borda estrutural `1px` padrão | — |
| `--hairline-strong` | `rgba(226, 194, 255, 0.44)` | Borda de foco/separação elevada | — |
| `--text-primary` | `#f5f0ff` | Texto principal, títulos e valores moleculares | 16.8:1 vs `--surface-bench` |
| `--text-secondary` | `#d2c2ec` | Descrições, dicas, rótulos de apoio | **10.6:1** vs `--surface-bench` |
| `--text-muted` | `#b39ddb` | Metadados técnicos e códigos secundários | **7.5:1** vs `--surface-bench` |

### Acentos, Bases Nitrogenadas & Estados Semânticos
Nunca depender exclusivamente da cor: todo estado e base combina **cor + letra/rótulo + ícone/forma**.

| Token CSS | Hex | Papel Semântico | Contraste vs `--surface-gel` (`#0b0617`) |
|---|---|---|---|
| `--accent-primary` | `#a855f7` | Acento ametista institucional de `qeop.html` | UI / bordas / barras |
| `--accent-bright` | `#e879f9` | Orquídea de destaque ativo e marcação investigativa | ~8.0:1 |
| `--accent-cta` | `#7c3aed` | Fundo do botão primário (com texto `#ffffff`) | `#ffffff` on `#7c3aed` → **5.7:1** |
| `--accent-cta-hover` | `#6d28d9` | Hover do botão primário (`#ffffff` on `#6d28d9`) | **7.1:1** |
| `--focus-ring` | `#f0abfc` | Anel `:focus-visible` (`2px solid`, `outline-offset: 2px`) | > 10:1 |
| `--base-A` | `#5eead4` | **Adenina (A)** — Turquesa Menta (Purina) | **12.9:1** |
| `--base-T` | `#f472b6` | **Timina (T)** — Rosa Espectral (Pirimidina) | **7.2:1** |
| `--base-C` | `#93c5fd` | **Citosina (C)** — Azul Gel (Pirimidina) | **10.7:1** |
| `--base-G` | `#fcd34d` | **Guanina (G)** — Âmbar Fluorescente (Purina) | **13.1:1** |
| `--state-match` | `#5eead4` | Compatível / Acerto (`✓` + rótulo explícito) | **12.9:1** |
| `--state-mismatch` | `#fb7185` | Divergente / Exclusão (`✕` + rótulo explícito) | **7.3:1** |
| `--state-pinned` | `#f0abfc` | Marcado manualmente pelo jogador durante a dedução (`PIN`) | **10.6:1** |

---

## 3. Typography Rules

Trio tipográfico alinhado ao ecossistema UFPA, com fallbacks métricos seguros para operação offline (`file:///`):

| Papel | Família | Tamanho | Peso | Altura de Linha | Uso |
|---|---|---|---|---|---|
| `display` | `'Space Grotesk', system-ui, sans-serif` | `clamp(1.45rem, 3vw, 2.25rem)` | 700 | `1.14` | Título principal (`h1`) e títulos de caso/relatório (`h2`), com `text-wrap: balance` |
| `body` | `'Inter', system-ui, sans-serif` | `0.9375rem`–`1rem` (`15–16px`) | 400 / 600 | `1.6` | Narrativa do caso, justificativas, guia rápido (`max-width: 68ch`, `text-wrap: pretty`) |
| `data-mono` | `'JetBrains Mono', ui-monospace, monospace` | `0.75rem`–`1.05rem` | 600 / 700 | `1.35` | Exclusivamente códigos (`CASO 01`), contadores (`tabular-nums`), alelos (`6×`), bases `A/T/C/G` e atalhos |

**Regras Tipográficas:**
- **Sem texto em gradiente decorativo** em títulos (`h1` sólido em `--text-primary` com contraste real).
- **Piso de legibilidade:** corpo narrativo `>= 15px`, rótulos interativos e controles `>= 12px` (`0.75rem`), zero microtexto `10px` para informação essencial.
- **`scroll-padding-top: 84px`** no `html` para que elementos focados via teclado nunca fiquem cobertos pelo HUD superior sticky (WCAG 2.2 SC 2.4.11 *Focus Not Obscured*).

---

## 4. Unified SVG Icon System & Component Discipline

1. **Zero emojis ou glifos Unicode (`✓`, `✕`, `→`) como ícones de UI:** todos os ícones são renderizados por um conjunto SVG vetorial único (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`), com `aria-hidden="true"` quando acompanhados de texto visível.
2. **Sem dependências frágeis de CSS em runtime:** estilos estruturais 100% autônomos em CSS semântico nativo (sem Tailwind CDN), garantindo carregamento instantâneo e determinístico inclusive via `file:///`.
3. **Sem bordas laterais espessas repetitivas (`border-left > 1px`)** nem cartões aninhados redundantes na Tela Inicial.
4. **Superfícies do navegador tematizadas:** `::selection`, `scrollbar-color`, `:focus-visible`, `color-scheme: dark`.

---

## 5. Active Deduction, Game Feel, 3D & Audio Contract

### Investigação Ativa (Pré-Veredito)
- **Casos STR / STR_SINGLE:** cada linha de alelo é clicável/focável (`aria-pressed`) para **pinar/parear alelos** visualmente antes de responder; alelos com mesmo valor recebem destaque coordenado (`PAREADO`) sem bloquear o envio direto da resposta.
- **Casos SEQ / QUIZ_SEQ:** botão **"Régua 1–12"** (`aria-pressed`) exibe índices de posição `01..12` e permite clicar em qualquer coluna/base para **marcar divergências manualmente** em sincronia entre a amostra analisada e as amostras de comparação.
- **Mapa de Casos & Revisão:** gaveta/modal listando os 9 casos com status (`Não iniciado`, `Acertou`, `Errou`), precisão e sequência (*streak*), permitindo navegar para revisar justificativas sem soft-lock.

### Tiers de Feedback (`triggerGameFeel(tier, outcome)`)
| Tier | Cena 3D (`PurpleDNA3D`) | UI / Movimento | Áudio (`SoundFX`) | Gatilhos |
|---|---|---|---|---|
| `small` | Pulso curto em 1 par de bases + boost `0.28` | Escala tátil `0.98` no botão/célula | Tom curto filtrado com variação ±5% de pitch | Marcar alelo, marcar coluna 1–12, abrir/fechar painel, trocar caso |
| `medium` | Onda luminosa ascendente na dupla-hélice (turquesa `#5eead4` ou coral `#fb7185`) + boost `2.1` / `0.65` | Destaque imediato de match/divergência nos alelos/bases + aparição suave da justificativa | Acorde harmônico ascendente (acerto) ou intervalo grave suave não punitivo (erro) | Confirmar veredito de um caso |
| `large` | Varredura espectral estendida na hélice + boost `2.8` | Celebração discreta no cartão do Relatório Final | Arpejo de conclusão em 4 notas (com brilho extra se `score >= 7`) | Concluir o 9º caso e abrir o Relatório Final |

### Grafo de Áudio (`SoundFX` — Web Audio API)
- `Oscillators / Envelopes` → `MasterGainNode` (volume persistido) → `DynamicsCompressorNode` (`threshold: -14`, `knee: 12`, `ratio: 6`, `attack: 0.005`, `release: 0.12`) → `AudioContext.destination`.
- Controle explícito de Mudo (`M`) persistido em `localStorage`.

### Cena 3D (`PurpleDNA3D` — Three.js r128)
- `pixelRatio` limitado a `Math.min(window.devicePixelRatio || 1, 1.5)` para estabilidade térmica mobile.
- Pausa automática do loop quando `document.hidden === true` (`visibilitychange`) e suporte a `webglcontextlost` / `webglcontextrestored`.
- Zero alocações por frame dentro de `animate()`.
- Modo **Movimento Reduzido**: ativado automaticamente por `prefers-reduced-motion: reduce` ou pelo botão no HUD, reduzindo rotação, desativando paralaxe/flashes e preservando transições de cor/estado.

---

## 6. Persistence (`localStorage`) & Ecosystem Integration

- **Chave versionada:** `biotec_qeop_save_v1`
  - Payload: `{ version: 1, currentIndex, answersByCaseId, bestScore, bestStreak, soundEnabled, reducedMotion }`
  - Leitura defensiva com `try/catch`, validação de schema/versão e fallback seguro sem perda de sessão.
- **Atalhos de Teclado:** `1`/`S` (Sim) e `2`/`N` (Não) ou `A`–`D` (Caso 9), `Enter` (Próximo Caso após resposta), `R` (alternar Régua 1–12 em casos SEQ), `C` (Mapa de Casos), `G` (Guia Rápido), `M` (Áudio), `Esc` (fechar modal ativo).
- **Navegação do Ecossistema (`ecosystem-nav.js`):**
  - Carregado com `data-page="qeop.html" data-theme="dark" data-pos="default"`.
  - **Zero Colisão:** `#ui-layer` reserva `padding-bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px))` em mobile e desktop para que o `.eco-dock` no canto inferior direito nunca encubra botões de ação ou o botão `Próximo Caso`.
  - **Alvos de toque:** todos os controles interativos possuem `min-height: 44px` e `min-width: 44px` com espaçamento `>= 8px`.
