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
2. **Jogo 02 — Jogo da Memória: Conexões do Caso (`GeneticMemoryGame`):** Quadro investigativo conectando pares científicos e forenses.
3. **Jogo 03 [NOVO] — Quiz de Verdadeiro ou Falso (`TrueOrFalseQuizGame`):** Desafio interativo com 8 afirmações sobre DNA, Biotecnologia Vermelha, PCR, Extração, Eletroforese e Genética Forense, com correção científica imediata, contador de sequência (*streak*) e efeitos sonoros.

### 6. 📂 Módulo 6 — Casos Solucionados (Aplicações Reais)
- 5 dossiês reais de Biotecnologia Vermelha e Genética Forense (*O Caso do Fio de Cabelo*, *Diagnóstico Precoce Neonatal*, *O Vestígio Invisível*, *Farmacogenômica na Oncologia* e *Laços de Sangue*).
- **Exibição Imediata no Campo de Visão:** O painel do dossiê aberto (`case-dossier-panel`) fica posicionado em destaque imediato no topo da visualização com auto-scroll suave e botão explícito `"FECHAR PASTA [X]"`, eliminando qualquer necessidade de adivinhar a rolagem.

---

## 📂 Estrutura de Arquivos

```text
ev/
├── index.html                   # Aplicação completa autocontida (pronta para abrir direto no navegador)
├── src/
│   └── App.jsx                  # Código-fonte modular React sincronizado 100% com o index.html
├── DESIGN.md                    # Documentação do Sistema de Design Tático-Científico (awesome-design-md)
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
