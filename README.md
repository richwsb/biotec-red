# 🧬 Extensão Biotecnologia Vermelha
### *Plataforma Educacional Interativa Multipage — DNA, Diagnóstico de Doenças & Genética Forense*

[![UFPA](https://img.shields.io/badge/UFPA-FABIOTEC-FFCC00?style=for-the-badge&logo=google-scholar&logoColor=black)](https://www.ufpa.br)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-Tactical_Biotech-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Engine-yellow?style=for-the-badge)](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Audio_API)

---

## 📌 Visão Geral do Projeto

A plataforma **Extensão Biotecnologia Vermelha** é uma aplicação web educacional interativa estruturada em **Arquitetura Multipage Modular (6 Módulos Independentes)**, desenvolvida no âmbito das atividades de Extensão Universitária da **Faculdade de Biotecnologia (FABIOTEC)** do **Instituto de Ciências Biológicas (ICB)** da **Universidade Federal do Pará (UFPA)**.

O projeto apresenta de forma didática, visual e gamificada os fundamentos do trabalho acadêmico **"Biotecnologia Vermelha — DNA e Diagnóstico"**, combinando **cards modulares ilustrados em SVG ("caixinhas")**, simulações laboratoriais de bancada, visualização 3D em tempo real e três jogos educativos.

---

## 🧭 Arquitetura Multipage em 6 Módulos Independentes

Para eliminar a sobrecarga cognitiva e proporcionar uma jornada de aprendizado clara tanto no computador quanto no celular, a plataforma é dividida em **6 Módulos dedicados** acessíveis pela Navbar principal, menu mobile e botões de progressão (`← Módulo Anterior` | `Próximo Módulo →`):

```text
├── 01. 🧬 Módulo 1 — DNA: A Molécula da Vida (Hélice 3D + Nucleotídeos + 4 Caixinhas Ilustradas + Regra de Chargaff)
├── 02. 🏥 Módulo 2 — DNA e Diagnóstico de Doenças (Biotecnologia Vermelha em 4 Caixinhas Ilustradas + Comparador Clínico)
├── 03. 🔍 Módulo 3 — Genética Forense (Perícia Criminal em 4 Caixinhas Ilustradas + Simulador de Paternidade STR)
├── 04. 🔬 Módulo 4 — Missão Laboratório (5 Etapas: Coleta, Extração Citológica, PCR Cadenciada, Eletroforese e Comparação)
├── 05. 🎮 Módulo 5 — Jogos (3 Desafios: Montagem da Fita, Jogo da Memória e Quiz de Verdadeiro ou Falso)
└── 06. 📁 Módulo 6 — Casos Solucionados (5 Dossiês Reais de Medicina Diagnóstica e Perícia com Leitura Imediata)
```

---

### 1. 🧬 Módulo 1 — DNA: A Molécula da Vida (`Three.js` + Caixinhas Ilustradas)
- **Visualizador 3D Holográfico (`DNA3DViewer`)** com 3 modos interativos:
  - **`DUPLA HÉLICE`**: Estrutura antiparalela completa com esqueleto de açúcar-fosfato, anéis químicos (Purinas de 2 anéis e Pirimidinas de 1 anel) e pontes de hidrogênio.
  - **`FITA SIMPLES`**: Isolamento de fita única exposta (modelo de RNA / sonda molecular).
  - **`NUCLEOTÍDEOS`**: Animação dinâmica 3D mostrando os **nucleotídeos livres se aproximando/unindo para formar os pares de bases (`A=T` e `C≡G`) com pontes de hidrogênio pulsantes e depois se separando ciclicamente** (hibridização e desnaturação).
- **4 Caixinhas Ilustradas Numeradas (`PASSO 01` → `PASSO 04`)** com diagramas SVG dedicados no topo e terminal interativo da **Regra de Chargaff** (`A`, `T`, `C`, `G` e comparativo com `U` do RNA).

### 2. 🏥 Módulo 2 — DNA e Diagnóstico de Doenças (Biotecnologia Vermelha)
- Organizado em **4 Caixinhas Ilustradas Numeradas** com diagramas vetoriais no topo:
  1. **Alterações Genéticas & Doenças Hereditárias** (mutação pontual SNP no gene *HBB* / Anemia Falciforme);
  2. **Diagnóstico Molecular Precoce & RT-qPCR Clínica** (curvas de fluorescência Ct e superação da janela imunológica);
  3. **Terapias Gênicas & Edição Molecular (CRISPR-Cas9)** (vetores virais, Cas9 + gRNA e células CAR-T);
  4. **Farmacogenômica & Medicina Personalizada** (ajuste de dose por perfil genético *CYP450 / DPYD* e vacinas de mRNA).
- Inclui o **Comparador Clínico de Biomarcadores Genéticos** (*HBB*, *BRCA1/2*, *DPYD*).

### 3. 🔍 Módulo 3 — Genética Forense (Perícia & Identificação Humana)
- Organizado em **4 Caixinhas Ilustradas Numeradas** com diagramas vetoriais forenses:
  1. **O DNA na Cena do Crime & Cadeia de Custódia** (vestígios biológicos e preservação sem contaminação);
  2. **Marcadores STR (*Short Tandem Repeats*) & Padrão CODIS** (repetições em tandem `[AGAT]n`);
  3. **Testes de Paternidade & Herança Mendeliana** (50% de alelos maternos e 50% de alelos paternos obrigatórios);
  4. **Pessoas Desaparecidas, Desastres & DNA Mitocondrial (mtDNA)** (identificação humana em amostras degradadas).
- Inclui o **Simulador Prático de Teste de Paternidade por STRs** (*D3S1358*, *vWA*, *FGA*).

### 4. 🔬 Módulo 4 — Missão Laboratório (Protocolo de 5 Etapas)
Simulador interativo passo a passo:
1. **Fase 01 — Coleta:** Cena coordenada em SVG onde a ponta de algodão do swab estéril **toca e esfrega fisicamente o centro do vestígio biológico**, absorvendo células nucleadas e transferindo a amostra para o microtubo `#CSI-042`.
2. **Fase 02 — Extração:** Ilustração citológica e bioquímica detalhada de uma **célula eucariótica** (bicamada lipídica da membrana plasmática, citoplasma com mitocôndrias/proteínas e núcleo celular com cromatina), demonstrando a lise pelas enzimas **Detergente + Proteinase K**, a precipitação dos detritos/lipídios/proteínas no fundo (**Pellet**) e o isolamento do **DNA Puro no Sobrenadante Aquoso**.
3. **Fase 03 — PCR (Reação em Cadeia da Polimerase):** Termociclador cadenciado permitindo acompanhar claramente as 3 fases térmicas (**95°C Desnaturação → 58°C Anelamento dos Primers → 72°C Extensão pela Taq Polimerase**) e a multiplicação exponencial ($2^n$).
4. **Fase 04 — Análise (Eletroforese em Gel):** Migração elétrica do polo negativo (`-`) para o polo positivo (`+`) separando bandas por tamanho.
5. **Fase 05 — Comparação & Match:** Raias de gel e linhas tracejadas conectoras renderizadas em um **único sistema de coordenadas SVG compartilhado**, garantindo alinhamento horizontal de 100% entre cada banda da `Amostra Coletada` e do `Perfil Alvo`.

### 5. 🎮 Módulo 5 — Jogos (Hub com 3 Desafios Interativos)
1. **Jogo 01 — Montagem da Fita Complementar (`MolecularPairingLab`):** Pareamento de bases com **layout mobile 100% responsivo** que exibe todos os **8 alvos simultaneamente na tela** (`grid-cols-4 sm:grid-cols-8`) sem corte lateral, com destaque visual no alvo ativo e nucleotídeos livres sempre acessíveis.
2. **Jogo 02 — Jogo da Memória: Conexões do Caso (`GeneticMemoryGame`):** Quadro investigativo com cartas ilustradas em **SVG vetorial puro (`MemoryCardIllustrationSVG`)** — estruturas químicas de purinas/pirimidinas (`A`, `T`, `C`, `G`), coleta com swab, eletroforese com padrão de bandas, heredograma mendeliano e árvore exponencial da PCR — exibindo estado de inspeção escuro e par combinado em Amarelo Ouro Tático (`#FACC15`).
3. **Jogo 03 [NOVO] — Quiz de Verdadeiro ou Falso (`TrueOrFalseQuizGame`):** Desafio interativo com 8 afirmações sobre DNA, Biotecnologia Vermelha, PCR, Extração, Eletroforese e Genética Forense, com correção científica imediata, contador de sequência (*streak*) e efeitos sonoros.

### 6. 📂 Módulo 6 — Casos Solucionados (Aplicações Reais)
- 5 dossiês reais de Biotecnologia Vermelha e Genética Forense (*O Caso do Fio de Cabelo*, *Diagnóstico Precoce Neonatal*, *O Vestígio Invisível*, *Farmacogenômica na Oncologia* e *Laços de Sangue*).
- **Exibição Imediata no Campo de Visão:** O painel do dossiê aberto (`case-dossier-panel`) fica posicionado em destaque imediato no topo da visualização com auto-scroll suave e botão explícito `"FECHAR PASTA [X]"`, eliminando qualquer necessidade de adivinhar a rolagem.

---

## 🌐 Ecossistema Conectado em 8 Ambientes (`ecosystem-nav.js`)

O script universal `ecosystem-nav.js` (Web Component em Shadow DOM isolado) conecta os 8 ambientes do projeto através de um **dock fixo no canto inferior direito em posição única invariante** (tanto no desktop quanto no celular) e com **paleta adaptativa automática por página (`PAGE_THEMES`)**:

1. **`index.html` — Portal Principal UFPA** (*Tactical Biotech* • `#FACC15`)
2. **`dna.html` — Dupla-Hélice B-DNA 3D** (*Molecular Cyan/Emerald* • `#22D3EE`) — visualização estrutural com os modos **Montada** e **Explodida**, filtros por componente e inspeção por raycasting.
3. **`pcr.html` — BioForense 3D: Lab PCR** (*Lab Emerald/Cyan* • `#10B981`) — bancada interativa em 5 estações (Coleta, Extração, PCR, Eletroforese e Comparação STR).
4. **`banner.html` — Banner 3D Interativo UFPA** (*Crimson Biotech* • `#E11D48`) — tripé metálico articulado a 120° com cinemática vetorial precisa sobre o piso `y = 0`, introdução cinematográfica de pareamento de DNA (Purinas/Pirimidinas + ondas de choque de pontes H) e desenrolamento em Espiral de Arquimedes.
5. **`folder.html` — Folder 3D Sustentabilidade** (*Editorial Forest & Sage Light* • `#245526`) — folheto dobrável frente e verso com controle contínuo e upload de artes.
6. **`mistery.html` — Arquivo Confidencial** (*Noir Brass & Manila* • `#C99E32`) — jogo de investigação criminal com dossiês, interrogatórios, mural de fios e veredito.
7. **`natal.html` (& `rvore_de_natal_3d_ascii.html`) — Noite Natalina & Árvore 3D ASCII** (*Glacial Night & Starlight Gold* • `#38BDF8` / `#FACC15`) — cena natalina 2D reativa ao vento e **Easter Egg de 5 toques seguidos na estrela da árvore**, ativando a transição cinematográfica para a **Árvore de Natal 3D Volumétrica ASCII (`FELIZ NATAL 2026`)**.
8. **`qeop.html` — DNA Forense 3D: Mistérios Genéticos** (*Espectroscopia UV-Violeta* • `#C084FC`) — jogo com 9 estudos de caso reais (STR autossômico, cromossomos X/Y, DNA felino e mtDNA de 12 bases), rascunho investigativo tátil, cena 3D reativa e síntese sonora procedural.

---

## 📂 Estrutura de Arquivos

```text
ev/
├── .github/
│   └── workflows/
│       └── ci.yml               # Validação automática de sintaxe JS e links relativos
├── .editorconfig                # Padrão de codificação (UTF-8, LF e indentação)
├── .gitattributes               # Normalização de quebras de linha e binários para Git
├── .gitignore                   # Exclusão de arquivos locais, logs e skills externas
├── .nojekyll                    # Compatibilidade direta com GitHub Pages (sem Jekyll)
├── index.html                   # Portal principal autocontido (6 módulos + SVG memory cards)
├── src/
│   └── App.jsx                  # Código-fonte modular React sincronizado 100% com o index.html
├── ecosystem-nav.js             # Navegação universal Shadow DOM (posição invariante + temas dinâmicos)
├── dna.html                     # Visualizador 3D B-DNA (modos Montada e Explodida)
├── pcr.html                     # Laboratório Forense 3D em 5 estações
├── banner.html                  # Banner Roll-Up 3D UFPA com tripé corrigido e intro DNA
├── folder.html                  # Folder 3D dobrável frente e verso
├── mistery.html                 # Jogo Noir Arquivo Confidencial (+ mistery-*.js e MISTERY-DESIGN.md)
├── qeop.html                    # Jogo DNA Forense 3D — Mistérios Genéticos (STR, X/Y, mtDNA + Three.js)
├── natal.html                   # Vila Natalina 2D ASCII + Modo 3D 2026 (Easter Egg na estrela)
├── rvore_de_natal_3d_ascii.html # Experiência standalone da Árvore 3D ASCII integrada ao ecossistema
├── DESIGN.md                    # Documentação do Design System do Portal & Ecossistema
├── MISTERY-DESIGN.md            # Contrato visual e de áudio do Arquivo Confidencial
├── QEOP-DESIGN.md               # Contrato visual, 3D, áudio e game feel do DNA Forense 3D
├── DNA E DIAGNÓSTICO BIOTEC...  # Pôster acadêmico oficial da extensão UFPA (alta resolução)
├── qrcode-biotec-red.png        # QR Code para acesso rápido em dispositivos móveis
├── qrcode-biotec-red.svg        # Vetor SVG do QR Code
└── README.md                    # Documentação técnica e científica do projeto
```

---

## 💻 Como Executar

### Opção 1: Execução Direta no Navegador
Dê dois cliques no arquivo `index.html` para abri-lo em qualquer navegador moderno (Chrome, Edge, Firefox ou Safari).

### Opção 2: Servidor HTTP Local
```bash
npx serve .
# ou
python -m http.server 8000
```

### Opção 3: Publicação no GitHub Pages
1. Suba o repositório para o GitHub na branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch** → branch `main` → pasta `/ (root)`.
3. O arquivo `.nojekyll` garante o carregamento direto de todas as páginas e assets estáticos.

---

## 👥 Equipe & Créditos Acadêmicos

Trabalho de Extensão Universitária desenvolvido por discentes do curso de **Biotecnologia** da **UFPA / ICB / FABIOTEC**:

* **Hanna Gabrielle Tavares Favacho**
* **Jéssica Larissa Valle de Souza**
* **Julliany Christinny Girard Carneiro**
* **Kayllane Cristine Bezerra Carvalho**
* **Maria Kailane da Silva de Souza**
* **Richard Wesley da Silva Barbosa**

---

<div align="center">
  <sub>Extensão Biotecnologia Vermelha // UFPA • ICB • FABIOTEC — Belém, Pará</sub>
</div>
