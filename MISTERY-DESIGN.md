# MISTERY-DESIGN.md — Arquivo Confidencial

> Contrato visual, tipográfico, tátil, sonoro e de acessibilidade do jogo investigativo noir **Arquivo Confidencial** (`mistery.html`, `mistery-engine.js`, `mistery-art.js`, `mistery-audio.js`, `mistery-cases.js`).
> **Escopo:** exclusivo do jogo. Não altera nem substitui `DESIGN.md` (que rege o portal principal UFPA).

---

## 1. Visual Theme & Atmosphere

**Identidade Preservada:** Noir Policial / Mesa de Detetive em Madeira Escura / Dossiê Manila / Papel Sulfite Envelhecido / Carimbo Carmim / Latão Polido.

**Modo de Superfície (`impeccable`):** **Operate + Experience**
- **Operate (clareza investigativa):** o jogador cruza datas, horários (`HHhMM`), depoimentos e provas físicas sob tensão. Legibilidade, escaneabilidade, foco de teclado e consistência de controles prevalecem sobre decoração.
- **Experience (atmosfera tátil):** a mesa de madeira escura sob luminária quente de latão, a pasta manila física com abas recortadas, o papel sulfite preso por clipe metálico, o mural de cortiça com alfinetes e fios tensos, e o carimbo de tinta carmim constroem imersão sem comprometer leitura.
- **Disciplina Narrativa (Anti-Spoiler):** toda a interface de entrada, cabeçalho, quadro da força-tarefa, medalhas bloqueadas e cartões bloqueados mantêm a identidade do mentor oculto em sigilo até que a própria investigação revele as ligações nos atos finais.

---

## 2. Color Palette & Semantic Roles

Todos os pares texto/superfície atendem ou superam **WCAG 2.2 AA (≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande e componentes UI)**. Nenhuma cor cinza fria sobre superfícies quentes; tons secundários são sempre tingidos pela família quente da mesa ou do papel.

### Superfícies Escuras (Mesa de Detetive & Chrome)
| Token CSS | Hex | Papel Semântico | Contraste com Texto Primário |
|---|---|---|---|
| `--desk-bg` | `#120f0d` | Fundo da mesa escura com granulação sutil | `#f3ead8` → 15.8:1 |
| `--desk-elevated` | `#1a1612` | Bandejas/gavetas da mesa e barra superior | `#f3ead8` → 14.3:1 |
| `--panel-dark` | `#211c17` | Painéis de controle, cartões de dossiê fechados | `#f3ead8` → 13.0:1 |
| `--panel-hover` | `#2b241e` | Estado hover/ativo em controles escuros | `#f3ead8` → 11.4:1 |
| `--panel-border` | `#463b30` | Hairline estrutural (1px) em superfícies escuras | ≥ 3:1 vs `--desk-bg` |
| `--panel-border-strong` | `#665543` | Borda de foco/destaque sutil em controles escuros | — |
| `--text-on-dark` | `#f3ead8` | Texto principal sobre a mesa escura | 14.3:1 vs `--desk-elevated` |
| `--text-on-dark-muted` | `#c8baa2` | Metadados, legendas e descrições sobre superfícies escuras (substitui `--ink-muted` em fundo escuro) | **9.1:1** vs `--desk-elevated` |

### Superfícies Claras (Pasta Manila & Papel Sulfite)
| Token CSS | Hex | Papel Semântico | Contraste |
|---|---|---|---|
| `--manila` | `#e7d9bc` | Corpo da pasta de dossiê aberta | `#1b1713` → 12.6:1 |
| `--manila-dark` | `#d5c29d` | Borda/sombra interna da pasta e aba inativa | `#1b1713` → 10.1:1 |
| `--paper` | `#f8f3e6` | Folha de depoimento, ficha pericial, modal diegético | `#1b1713` → 16.0:1 |
| `--paper-alt` | `#efe7d3` | Caixas auxiliares, extratos e opções de formulário | `#1b1713` → 14.1:1 |
| `--paper-border` | `#c4b18a` | Hairline estrutural (1px) sobre papel/manila | — |
| `--ink` | `#1b1713` | Tinta principal sobre papel/manila | 16.0:1 vs `--paper` |
| `--ink-muted` | `#4d4236` | Metadados e texto secundário **exclusivamente sobre papel/manila** | **8.2:1** vs `--paper` / **6.6:1** vs `--manila` |

### Acentos, Carimbos e Estados Semânticos
| Token CSS | Hex | Papel Semântico |
|---|---|---|
| `--brass` | `#c99e32` | Latão do distintivo, foco de teclado, ação primária na mesa |
| `--brass-bright` | `#e7c873` | Texto/ícone em latão sobre superfícies escuras (contraste ≥ 9.8:1) |
| `--brass-ink` | `#6b4d08` | Acento dourado legível sobre papel claro (contraste ≥ 6.1:1 vs `--paper`) |
| `--stamp-red` | `#991b1b` | Carimbo carmim sobre papel claro (contraste 7.5:1 vs `--paper`) |
| `--stamp-red-dark` | `#f07070` | Alerta/carimbo legível sobre superfícies escuras (contraste 6.4:1 vs `#1a1612`) |
| `--solved-light` | `#185c39` | Carimbo de caso resolvido sobre papel claro (contraste 7.8:1 vs `--paper`) |
| `--solved-dark` | `#5ed493` | Carimbo/progresso concluído sobre superfícies escuras (contraste 9.9:1 vs `#1a1612`) |
| `--blueprint-bg` | `#141d24` | Fundo cianotipia da planta baixa da cena do crime |
| `--blueprint-line` | `#8bbad1` | Traços técnicos da planta baixa |
| `--cork-bg` | `#7b5535` | Superfície de cortiça do Mural de Fios Vermelhos |
| `--focus-ring` | `#f0cc69` | Anel de foco (`outline: 2px solid`, `outline-offset: 2px`, contraste > 10:1) |

---

## 3. Typography Rules

Preserva o trio tipográfico editorial já estabelecido, com fallbacks métricos seguros para operação 100% offline (`file:///`):

| Papel | Família | Tamanho | Peso | Altura de Linha | Uso |
|---|---|---|---|---|---|
| `display-title` | `'Newsreader', Georgia, serif` | `clamp(1.3rem, 2.2vw, 1.75rem)` | 700 | `1.18` | Títulos de dossiê, nome do detetive, títulos de seção |
| `statement-quote` | `'Newsreader', Georgia, serif` (italic) | `1.04rem` | 500 | `1.62` | Depoimentos e transcrições literais (medida máx. `68ch`) |
| `body` | `'Inter', system-ui, sans-serif` | `0.9375rem`–`1rem` (`16px` em inputs/mobile) | 400 / 600 | `1.58` | Narrativa, descrições, instruções (medida `65–75ch`, `text-wrap: pretty`) |
| `data-mono` | `'IBM Plex Mono', ui-monospace, monospace` | `0.75rem`–`0.875rem` | 600 / 700 | `1.35` | Exclusivamente códigos de dossiê (`DOSSIÊ #01-482`), horários (`21h32`), carimbos, logs periciais e contadores com `font-variant-numeric: tabular-nums` |

**Regras Tipográficas (`typeset.md` + `craft-floor.md`):**
- `text-wrap: balance` em títulos (`h1`, `h2`, `h3`, `.section-title`, `.case-title`).
- `text-wrap: pretty` em parágrafos de narrativa e depoimentos.
- **Zero eyebrows/kickers redundantes acima de títulos**: o título carrega seu próprio peso; metadados (ato, dificuldade, código) aparecem como chips inline discretos ou subtítulo de dados, nunca como faixa superior repetida.
- Inputs, selects e textareas sempre `>= 16px` no mobile (`≤ 640px`) para evitar auto-zoom no iOS Safari.

---

## 4. Unified SVG Icon System

**Banimento total de emojis e glifos Unicode como ícones de UI** (`🏅`, `🔒`, `⚠`, `⚙`, `&#9741;`, `&#128274;`, `&#9733;`, `▲`, `▼`, `&#8644;`, `&#8634;`).
- Todos os ícones de interface residem em `MisteryArt.getUIIconSVG(name, size)` com geometria consistente (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.85"`, `stroke-linecap="round"`, `stroke-linejoin="round"`).
- Ícones decorativos ao lado de texto visível recebem `aria-hidden="true"`.
- Botões somente-ícone recebem obrigatoriamente `aria-label` descritivo (e `aria-expanded` / `aria-pressed` quando aplicável).

---

## 5. Craft Floor & Component Discipline

1. **Sem bordas laterais espessas repetitivas (`border-left > 1px`):** substituídas por bordas hairline `1px solid`, filetes superiores discretos ou carimbos/selos de estado.
2. **Sem cartões aninhados desnecessários na Tela Inicial:** a Central do Detetive usa estrutura de **Arquivo Policial com Abas (Divulgação Progressiva)**:
   - Faixa superior compacta da Credencial do Detetive (distintivo + patente + progresso + CTA principal único + resumo em linha).
   - Gavetas alternáveis (`role="tablist"`): **Campanha Principal (7)** | **Casos Paralelos (3)** | **Medalhas & Honrarias** | **Backup & Comunidade**.
   - Elimina o "muro vertical de cards" e coloca os casos clicáveis imediatamente na primeira dobra em desktop e mobile.
3. **Sem estilos inline em `mistery-engine.js` nem `onclick="..."` no HTML:** toda apresentação vem de classes semânticas em `mistery.html`.
4. **Superfícies do navegador tematizadas:** `::selection`, `caret-color`, `scrollbar-color`, `:focus-visible`, `scroll-padding-top: 84px` (garantindo WCAG 2.2 SC 2.4.11 *Focus Not Obscured* sob a topbar sticky).
5. **Diálogos Diegéticos:** substituição total de `window.prompt()` e `window.confirm()` por modais estilizados como memorandos oficiais da Divisão de Homicídios, gerenciados pela pilha de overlays com *focus trap*.

---

## 6. Game Feel, Motion & Audio Contract

### Tiers de Feedback (`triggerFeedback(tier, origin)`)
| Tier | Trauma (Shake) | Hit-Stop / Flash | Partículas (HiDPI) | Áudio | Eventos |
|---|---|---|---|---|---|
| `small` | `0.00` | Nenhum | `0` | Bus `UI` (variação ±5% pitch) | Trocar aba, inspecionar ponto, clicar dígito, selecionar suspeito |
| `medium` | `0.24` | Nenhum | `10–14` fagulhas douradas | Bus `SFX` (duck leve se conquista/desbloqueio) | Coletar evidência, abrir cadeado/enigma, confirmar fio pericial, medalha |
| `large` | `0.65` | `85ms` micro hit-stop + vinheta sutil | `28–38` respingos de tinta / fagulhas | Bus `SFX` + ducking suave de `Ambience` & `Music` | Contradição exposta, carimbo de veredito, perda de autoridade |

- **Trauma Shake:** `shake = trauma² × userShakeIntensity`, senoides em frequências inarmônicas (`sin(t*1.7)`, `sin(t*2.3)`, `sin(t*1.1)`) via `requestAnimationFrame`, retornando exatamente a `transform: none` ao zerar. Slider `0–100%` nas configurações + desligamento automático sob `prefers-reduced-motion: reduce`.
- **Typewriter Sem Pulo de Linha:** texto completo pré-medido no DOM com spans inline (`.tw-vis` + `.tw-hid { color: transparent }`), animação por `requestAnimationFrame`, pulável com clique ou `Space`/`Enter`, velocidades `Normal` / `Rápido` / `Instantâneo`.
- **Grafo de Áudio (Web Audio API):** `Master (+ DynamicsCompressorNode Limiter)` ← `Ambience (via AmbienceDuck)`, `Music (via MusicDuck)`, `SFX`, `UI`. Sliders `0..1` mapeados em curva perceptual quadrática (`v * v`, mudo real em `0`).

---

## 7. Responsive & Accessibility Guardrails

| Breakpoint | Layout | Regras Obrigatórias |
|---|---|---|
| Desktop `≥ 1024px` (`1440×900`, `1024×768`) | Grade 2 colunas na Cena, Master-Detail em Suspeitos, Mural com Zoom + Fit-to-View | `max-width: 1240px`, folga inferior `5.5rem` acima do `ecosystem-nav.js` |
| Tablet `768px–1023px` | Refluxo adaptativo para 1 coluna em cenas/comparador | Alvos ≥ `44×44px` em dispositivos touch |
| Mobile `≤ 640px` (`390×844`) | Coluna única, barra de abas rolável com snap, suspeitos em strip horizontal, controles sem overflow horizontal | `scrollWidth <= clientWidth` (0px overflow), todos botões/inputs ≥ `44×44px`, `env(safe-area-inset-bottom)` + folga mínima de `5.5rem` acima do dock `ecosystem-nav.js` |

- **WCAG 2.2 SC 2.5.7 (Dragging Movements):** o Mural de Fios Vermelhos oferece controle 100% operável sem arrastar (seletores de conexão + botões de reposicionamento/teclas de seta + Undo/Redo).
- **Reduced Motion:** remove movimento espacial, tremor e flashes, preservando transições suaves de opacidade/cor e feedback de estado.
