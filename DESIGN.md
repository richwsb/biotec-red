---
version: 2.1.0
name: Extensao-Biotecnologia-Vermelha-UFPA
description: Sistema de Design Tático-Científico e Biomolecular para a plataforma educacional interativa "Extensão Biotecnologia Vermelha" (UFPA / ICB / FABIOTEC) e seu ecossistema conectado em 7 ambientes (Portal UFPA, B-DNA 3D, BioForense 3D, Banner 3D, Folder 3D, Arquivo Confidencial e Cena Natalina ASCII 2D/3D). Combina fundo escuro de alto contraste com paletas autorais por ambiente, tipografia técnica (Space Grotesk, Inter, JetBrains Mono), arquitetura multipage em 6 módulos e ilustrações vetoriais em SVG.

colors:
  primary: "#FACC15"
  primary-active: "#EAB308"
  biotech-red: "#F43F5E"
  biotech-red-soft: "#881337"
  forensic-cyan: "#22D3EE"
  forensic-emerald: "#34D399"
  ink: "#F4F4F5"
  body: "#D4D4D8"
  muted: "#A1A1AA"
  muted-soft: "#71717A"
  hairline: "#27272A"
  hairline-strong: "#3F3F46"
  canvas: "#000000"
  surface-soft: "#09090B"
  surface-card: "#121215"
  surface-elevated: "#18181B"
  on-primary: "#000000"
  success: "#34D399"
  warning: "#FACC15"
  error: "#FB7185"

typography:
  display-xl:
    fontFamily: "Space Grotesk, Inter, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: -1.4px
  display-lg:
    fontFamily: "Space Grotesk, Inter, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.9px
  title-lg:
    fontFamily: "Space Grotesk, Inter, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.3px
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  code-mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.2px
---

# Extensão Biotecnologia Vermelha — Design System (`DESIGN.md`)

Documento canônico de design tático-científico da plataforma **Extensão Biotecnologia Vermelha** (**UFPA / ICB / FABIOTEC**), estruturado segundo os padrões de `awesome-design-md`, `ui-ux-pro-max`, `taste-skill` e `impeccable`.

---

## 1. Arquitetura de Informação Multipage (6 Módulos Independentes)

Para eliminar a sobrecarga cognitiva de páginas longas e garantir foco didático em Desktop e Mobile, a experiência é dividida em **6 Módulos Independentes** acessíveis via Navbar persistente, menu mobile dedicado e barra de progressão sequencial (`← Módulo Anterior` | `Próximo Módulo →`):

1. **Módulo 1 — DNA: A Molécula da Vida**: Visualizador holográfico 3D (`Dupla Hélice`, `Fita Simples`, `Nucleotídeos` com hibridização e desnaturação cíclica), 4 caixinhas ilustradas sobre a estrutura química do DNA e terminal interativo da Regra de Chargaff (`A`, `T`, `C`, `G`, `U`).
2. **Módulo 2 — DNA e Diagnóstico de Doenças**: Foco em **Biotecnologia Vermelha** em 4 caixinhas ilustradas numeradas (Mutações/Doenças Hereditárias, RT-qPCR e Diagnóstico Precoce, Terapias Gênicas/CRISPR-Cas9 e Farmacogenômica/Medicina Personalizada) + comparador clínico de alelos.
3. **Módulo 3 — Genética Forense**: Foco em **Perícia e Identificação Humana** em 4 caixinhas ilustradas numeradas (Evidência Científica e Cadeia de Custódia, Marcadores STR/CODIS, Testes de Paternidade e Identificação de Desaparecidos/mtDNA) + simulador de herança alélica STR.
4. **Módulo 4 — Missão Laboratório (Etapas)**: Simulador passo a passo das 5 fases periciais (**01. Coleta** com contato físico do swab no vestígio, **02. Extração** com lise citológica detalhada e separação pellet/sobrenadante, **03. PCR** cadenciada em 3 temperaturas, **04. Eletroforese** e **05. Comparação** com alinhamento vetorial exato das bandas de Match).
5. **Módulo 5 — Jogos (Desafios Interativos)**: Hub gamificado com 3 minigames selecionáveis:
   - *Desafio 01*: Montagem da Fita Complementar (`MolecularPairingLab` com grade responsiva de 8 alvos visíveis simultaneamente no mobile);
   - *Desafio 02*: Jogo da Memória: Conexões do Caso (`GeneticMemoryGame` com cartas tático-científicas ilustradas em SVG vetorial `MemoryCardIllustrationSVG` — pares combinados em Amarelo Ouro `#FACC15` / Preto `#09090B` e inspeção em Preto / Amarelo, com cantoneiras `┌ ┐ └ ┘`, diagramas moleculares/forenses, faixa de dupla-hélice e telemetria HUD);
   - *Desafio 03*: Quiz de Verdadeiro ou Falso (`TrueOrFalseQuizGame`).
6. **Módulo 6 — Casos Solucionados (Aplicações Reais)**: Dossiês clínicos e forenses com visualização imediata no campo de visão do usuário (`scrollIntoView` + painel expandido no topo/drawer com botão explícito de leitura e fechamento).

---

## 2. Sistema de Caixinhas Modulares Ilustradas (Anti-Sobrecarga Visual)

Nos Módulos 1, 2 e 3, cada conceito teórico é apresentado em **cards modulares numerados (`PASSO 01` → `PASSO 04`)**:
- **Cabeçalho de Ordem de Leitura**: Badge numérico (`PASSO 01`, `PASSO 02`...) + categoria técnica à direita, guiando o olhar na sequência correta.
- **Ilustração Vetorial Dedicada (SVG)**: Topo de cada card equipado com diagrama científico em SVG de alto contraste (células, fitas de DNA, curvas de PCR, CRISPR, STRs, eletroforese).
- **Escaneabilidade**: Título em `Space Grotesk`, resumo objetivo de 2–3 linhas em `Inter` e lista de 3 pontos-chave curtos.

---

## 3. Ecossistema Conectado (`ecosystem-nav.js`): Posição Invariante & Paletas Adaptativas

O componente Web Component `<biotec-ecosystem-nav>` (Shadow DOM isolado) unifica os **7 ambientes** da extensão com **memória muscular preservada** e **identidade cromática contextual**:

- **Posição Canônica Única e Invariante:** `.eco-dock` ancorado sempre no **canto inferior direito**:
  - Desktop: `bottom: calc(16px + env(safe-area-inset-bottom, 0px)); right: calc(16px + env(safe-area-inset-right, 0px));`
  - Mobile (`<= 640px`): `bottom: calc(12px + env(safe-area-inset-bottom, 0px)); right: calc(12px + env(safe-area-inset-right, 0px));` (alvos de toque `>= 44px`).
- **Regra de Zero Colisão:** todos os HUDs locais (`dna.html`, `pcr.html`, `banner.html`, `folder.html`, `mistery.html`, `natal.html`) reservam o quadrante inferior direito via espaçamento responsivo dedicado.
- **Paletas Sincronizadas (`PAGE_THEMES` via CSS Custom Properties `--eco-*`):**

| Ambiente | Identidade | Superfície Dock (`--eco-bg`) | Borda (`--eco-border`) | Acento Primário (`--eco-accent`) | Hover (`--eco-accent-hover`) | Contraste no Botão |
|---|---|---|---|---|---|---|
| `index.html` | Tactical Biotech (UFPA) | `rgba(9, 10, 14, 0.88)` | `rgba(250, 204, 21, 0.38)` | `#FACC15` | `#FDE047` | `#09090B` |
| `dna.html` | Molecular Cyan/Emerald (Montada & Explodida) | `rgba(7, 13, 26, 0.86)` | `rgba(34, 211, 238, 0.38)` | `#22D3EE` | `#67E8F9` | `#04131D` |
| `pcr.html` | Lab Emerald/Cyan (BioForense 3D) | `rgba(10, 17, 32, 0.86)` | `rgba(16, 185, 129, 0.40)` | `#10B981` | `#34D399` | `#021810` |
| `banner.html` | Crimson Biotech (UFPA Roll-Up 3D) | `rgba(15, 9, 13, 0.86)` | `rgba(244, 63, 94, 0.38)` | `#E11D48` | `#F43F5E` | `#FFFFFF` |
| `folder.html` | Editorial Forest & Sage Light | `rgba(252, 254, 252, 0.88)` | `rgba(36, 85, 38, 0.28)` | `#245526` | `#1B411D` | `#FFFFFF` |
| `mistery.html` | Noir Brass & Manila (`MISTERY-DESIGN.md`) | `rgba(26, 22, 18, 0.90)` | `rgba(201, 158, 50, 0.42)` | `#C99E32` | `#E7C873` | `#120F0D` |
| `natal.html` / `rvore_de_natal_3d_ascii.html` | Glacial Night & Starlight Gold (2D + 3D) | `rgba(6, 11, 20, 0.84)` | `rgba(56, 189, 248, 0.35)` | `#38BDF8` (+ `#FACC15`) | `#7DD3FC` | `#04070D` |
