/* ============================================================================
   ARQUIVO CONFIDENCIAL — Casos Narrativos (Campanha + Paralelos + Conquistas)
   7 casos da campanha principal (Caso 00 Tutorial + Atos I–III + Ato Final),
   3 Casos Paralelos avulsos, 15 medalhas, 5 patentes e validador JSON.
   ============================================================================ */
(function (global) {
    'use strict';

    const MISTERY_RANKS = [
        { minPoints: 0, title: 'Cadete de Plantão', tier: 0 },
        { minPoints: 100, title: 'Investigador Júnior', tier: 1 },
        { minPoints: 250, title: 'Inspetor de Homicídios', tier: 2 },
        { minPoints: 450, title: 'Comissário Especial', tier: 3 },
        { minPoints: 620, title: 'Lenda da Divisão', tier: 4 }
    ];

    const MISTERY_ACHIEVEMENTS = [
        { id: 'first_blood', title: 'Batismo de Fogo', desc: 'Solucione seu primeiro inquérito com êxito.', icon: 'first_blood' },
        { id: 'no_hints', title: 'Sem Dicas', desc: 'Encerre um caso sem consultar o Legista Chefe.', icon: 'no_hints' },
        { id: 'straight_to_point', title: 'Direto ao Ponto', desc: 'Resolva um caso confrontando apenas o verdadeiro culpado (sem confrontar inocentes).', icon: 'straight_to_point' },
        { id: 'lone_wolf', title: 'Lobo Solitário', desc: 'Solucione um caso completo sem abrir o Caderno de Anotações.', icon: 'lone_wolf' },
        { id: 'iron_badge', title: 'Distintivo Intacto', desc: 'Vença um caso com 100% de Autoridade do Detetive restante.', icon: 'iron_badge' },
        { id: 'red_string_master', title: 'Mente Conectada', desc: 'Confirme 3 ou mais conexões periciais corretas com fios vermelhos no Mural.', icon: 'red_string_master' },
        { id: 'locksmith', title: 'Mestre dos Cadeados', desc: 'Decifre 3 mini-enigmas (cofres, celulares ou cifras) na Cena do Crime.', icon: 'locksmith' },
        { id: 'split_vision', title: 'Visão Cruzada', desc: 'Use o Comparador Lado a Lado para cruzar dois documentos.', icon: 'split_vision' },
        { id: 'wrong_turn', title: 'Bode Expiatório', desc: 'Prenda um inocente com crime menor e testemunhe um epílogo alternativo.', icon: 'wrong_turn' },
        { id: 'sahur_fall', title: 'Silêncio do Tambor', desc: 'Desmantele a cúpula do Sindicato no Ato Final e silencie as três batidas das 03h33.', icon: 'sahur_fall' },
        { id: 'grand_detective', title: 'Arquivo Encerrado', desc: 'Resolva todos os 7 casos da campanha principal.', icon: 'grand_detective' },
        { id: 'community_sleuth', title: 'Investigador Sem Fronteiras', desc: 'Importe um caso customizado da comunidade em formato JSON.', icon: 'community_sleuth' },
        { id: 'parallel_sleuth', title: 'Arquivo Paralelo', desc: 'Solucione seu primeiro Caso Paralelo fora da campanha principal.', icon: 'parallel_sleuth' },
        { id: 'cold_case_closer', title: 'Dossiês Avulsos Encerrados', desc: 'Encerre todos os 3 Casos Paralelos da Divisão.', icon: 'cold_case_closer' },
        { id: 'thorough_investigator', title: 'Perícia Completa', desc: 'Colete e desbloqueie 100% das evidências de um caso antes de encerrá-lo.', icon: 'thorough_investigator' }
    ];

    const MISTERY_CASES = [
        /* ===================== CASO 0: TUTORIAL ===================== */
        {
            id: 'caso-00',
            order: 0,
            act: 'Tutorial',
            isTutorial: true,
            unlockRequires: null,
            code: 'CASO 00 • TUTORIAL',
            title: 'O Sumiço do Relógio na Relojoaria',
            difficulty: 'Tutorial (5 min)',
            victim: 'Sr. Alfredo Borges (proprietário da Relojoaria Central — furto qualificado)',
            location: 'Relojoaria Central (Balcão & Oficina dos Fundos)',
            timeOfDeath: 'Entre 09h15 e 09h35 (manhã de terça-feira)',
            crimeWindowLabel: 'JANELA DO FURTO: 09h15 – 09h35 (Câmera registra invasor às 09h22)',
            summary:
                'Treinamento de campo da Divisão: antes de enfrentar homicídios complexos, investigue o furto de um cronômetro raríssimo avaliado em R$ 120 mil. Explore a planta baixa clicando nos pontos para coletar evidências, decifre o cadeado do armário e confronte a contradição de quem mentiu no depoimento.',
            hotspots: [
                {
                    id: 'counter',
                    x: 135, y: 120,
                    label: 'Balcão & Câmera Interna',
                    detail: 'A câmera frontal cobre todo o balcão e a porta dos fundos. Você recolhe a gravação da manhã (Evidência E2).',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'locker',
                    x: 320, y: 115,
                    label: 'Armário de Ponto & Cofre',
                    detail: 'O registro eletrônico e o ticket caído atrás da porta estão trancados por um teclado numérico de 4 dígitos. Dica do Sr. Alfredo em E1: "Ano de fundação da loja".',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-00',
                        type: 'keypad',
                        title: 'Teclado do Armário da Oficina',
                        prompt: 'Digite os 4 dígitos da senha para abrir o armário de registro biométrico.',
                        clueRef: 'Consulte E1 (Relatório da Relojoaria) para descobrir o ano de fundação.',
                        answer: '1984',
                        unlocksEvidences: ['e3']
                    }
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="240" fill="#152028"/>
                    <g stroke="#29404f" stroke-width="0.6">
                        <path d="M0 40H440M0 80H440M0 120H440M0 160H440M0 200H440"/>
                        <path d="M40 0V240M80 0V240M120 0V240M160 0V240M200 0V240M240 0V240M280 0V240M320 0V240M360 0V240M400 0V240"/>
                    </g>
                    <rect x="30" y="30" width="380" height="180" fill="rgba(40,68,85,0.22)" stroke="#88b8d0" stroke-width="3"/>
                    <line x1="225" y1="30" x2="225" y2="210" stroke="#88b8d0" stroke-width="2" stroke-dasharray="6 4"/>
                    <rect x="65" y="95" width="130" height="50" rx="3" fill="#253b4a" stroke="#7cb0c9" stroke-width="1.8"/>
                    <text x="130" y="124" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="10">BALCÃO / VITRINE</text>
                    <rect x="260" y="75" width="120" height="80" rx="3" fill="#1f313d" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="320" y="108" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">OFICINA FUNDOS</text>
                    <text x="320" y="123" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="8">(Armário Trancado)</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'elena',
                    name: 'Elena Costa',
                    age: 28,
                    role: 'Atendente da vitrine',
                    profile: 'Atenciosa e pontual; trabalha no atendimento há 3 anos.',
                    statement: 'Eu não saí da frente do balcão em momento algum entre 09h00 e 09h45 porque estava conferindo o estoque de pulseiras.',
                    alibi: 'Permaneceu atrás do balcão principal durante toda a janela do furto.',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'Você viu alguém entrar na oficina dos fundos?', a: 'Vi apenas um vulto rápido às 09h22 perto da cortina, mas achei que fosse o Paulo pegando alguma caixa.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response: 'Elena sorri aliviada: "A câmera prova exatamente o que eu disse! Não deixei o balcão nem por dez segundos."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Elena franze a testa: "Detetive, isso não contradiz nada do que fiz hoje de manhã."',
                    wrongMood: 'nervous'
                },
                {
                    id: 'paulo',
                    name: 'Paulo Mendes',
                    age: 34,
                    role: 'Entregador terceirizado',
                    profile: 'Apressado; entregou encomendas no bairro vizinho naquela manhã.',
                    statement: 'Peguei o protocolo às 09h14 e saí de moto imediatamente para o centro. Só retornei às 09h50.',
                    alibi: 'Estava na rua fazendo entregas (comprovado pelo recibo do café da esquina).',
                    portrait: 'man_hat',
                    questions: [
                        { id: 'q1', q: 'Você pegou algum envelope extra antes de sair?', a: 'Não, só a caixa pequena da vitrine. Nem entrei na oficina hoje!', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e1',
                            response: 'Paulo aponta para o recibo: "Olha aí! Assinei o café na esquina às 09h24, a quatro quadras daqui. Não fui eu!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Paulo revira os olhos: "Eu estava longe daqui na hora do roubo!"',
                    wrongMood: 'furious'
                },
                {
                    id: 'vicente',
                    name: 'Vicente Prado',
                    age: 22,
                    role: 'Aprendiz de relojoeiro',
                    profile: 'Tímido, endividado recentemente e sempre atento ao relógio de bolso.',
                    statement: 'Eu saí para a farmácia às 09h10 e fiquei fora até as 09h50 por causa da fila enorme! Nem pisei na oficina durante esse horário.',
                    alibi: 'Alega ter ficado na farmácia das 09h10 às 09h50.',
                    portrait: 'man_glasses',
                    questions: [
                        { id: 'q1', q: 'Você sabia o valor daquela peça rara?', a: 'Claro, o Sr. Alfredo falava dela o tempo todo... mas eu nunca trairia o mestre por conta própria.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response: 'Vicente começa a suar frio e abaixa a cabeça: "O leitor biométrico gravou meu crachá às 09h22?! Está bem, fui eu! O ticket da farmácia é só das 09h42... Fui coagido por um homem que deixou um bilhete pedindo para eu entregar o relógio após três batidas na madrugada: T.T.T.S.!"',
                            unlocksEvidenceId: 'e4',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Vicente ajeita os óculos nervoso: "Isso... isso não prova que estive na oficina!"',
                    wrongMood: 'nervous'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Relatório Inicial & Recibo do Café',
                    type: 'receipt',
                    initial: true,
                    desc: 'Anotação de abertura do boletim e comprovante do entregador.',
                    doc: 'OCORRÊNCIA: Furto de cronômetro na oficina dos fundos (09h15–09h35).\nRECIBO CAFÉ ESQUINA: Paulo Mendes pagou café às 09h24 (4 quadras dali).\nNOTA DO SR. ALFREDO: "Senha do armário de ponto: ano de fundação da loja (1984)."'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Câmera Interna do Balcão',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'counter',
                    desc: 'Registro da câmera instalada acima da vitrine frontal.',
                    doc: '09h00–09h45 -> Elena Costa permaneceu o tempo inteiro atrás do balcão frontal.\n09h22 -> Sombra entra pela porta lateral dos fundos em direção à oficina.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Ponto Biométrico & Ticket da Farmácia',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'locker',
                    desc: 'Recolhidos dentro do armário trancado da oficina dos fundos.',
                    doc: 'LEITOR DA OFICINA: Crachá #03 (Vicente Prado) abriu a oficina às 09h22.\nTICKET DA FARMÁCIA (encontrado no lixo): Emitido às 09h42 (não às 09h10!).\nCARTÃO ANEXO: "Entrega às 03h33 — Ass.: T.T.T.S."'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Confissão de Vicente (Desbloqueada)',
                    type: 'message',
                    secret: true,
                    desc: 'Depoimento complementar obtido ao confrontar Vicente com E3.',
                    doc: 'CONFISSÃO: Vicente furtou o cronômetro às 09h22 para quitar uma dívida com um intermediário misterioso identificado apenas pelas siglas T.T.T.S. (03h33).'
                }
            ],
            timeline: [
                { time: '09h00', text: 'Elena assume o posto na vitrine (confirmado por vídeo até 09h45).', source: 'Evidência E2', requiresEvidence: 'e2', crimeWindow: false },
                { time: '09h14', text: 'Paulo sai de moto para entregas no centro.', source: 'Depoimento', crimeWindow: false },
                { time: '09h22', text: 'Crachá de Vicente abre a oficina dos fundos; câmera capta vulto entrando.', source: 'Evidências E2 & E3', requiresEvidence: 'e3', crimeWindow: true },
                { time: '09h24', text: 'Paulo paga café a quatro quadras da relojoaria.', source: 'Evidência E1', crimeWindow: false },
                { time: '09h42', text: 'Vicente emite ticket na farmácia — 20 minutos após o furto.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: false }
            ],
            keyConnections: [
                { from: 'suspect:vicente', to: 'evidence:e3', relation: 'contradiz', insight: 'O ponto biométrico (09h22) e o ticket (09h42) desmentem o álibi de Vicente!' },
                { from: 'suspect:elena', to: 'evidence:e2', relation: 'confirma', insight: 'A câmera confirma que Elena não saiu da vitrine.' },
                { from: 'suspect:paulo', to: 'evidence:e1', relation: 'confirma', insight: 'O recibo do café às 09h24 inocenta Paulo.' }
            ],
            hints: [
                'Nível 1: Clique nos dois marcadores da Planta Baixa para coletar E2 e abrir o cadeado do armário com o ano citado em E1 (1984).',
                'Nível 2: Use o Comparador Lado a Lado ou leia E3: Vicente disse que foi à farmácia às 09h10, mas o leitor biométrico e o ticket dizem outra coisa.',
                'Nível 3: Confronte Vicente Prado com E3 na aba Suspeitos e acuse-o no Quadro de Acusação usando E3 como quebra de álibi!'
            ],
            accusationOptions: {
                methods: [
                    { id: 'backroom_theft', label: 'Entrada direta na oficina dos fundos usando crachá próprio às 09h22' },
                    { id: 'glass_break', label: 'Arrombamento da vitrine frontal durante o atendimento' },
                    { id: 'delivery_swap', label: 'Troca fraudulenta da encomenda antes da entrega de moto' }
                ],
                alibiBreakers: [
                    { id: 'e3', label: 'E3 — Ponto Biométrico da Oficina (09h22) e Ticket da Farmácia (09h42)' },
                    { id: 'e2', label: 'E2 — Câmera Interna do Balcão' },
                    { id: 'e1', label: 'E1 — Recibo do Café da Esquina' }
                ]
            },
            solution: {
                culpritId: 'vicente',
                methodId: 'backroom_theft',
                alibiBreakerId: 'e3',
                syndicateClue: 'Cartão "T.T.T.S. — 03h33" encontrado com Vicente indica uma rede criminosa receptando relógios raros.',
                explanation:
                    'Excelente estreia, detetive! Elena tinha álibi em vídeo (E2) e Paulo estava a quatro quadras às 09h24 (E1). Vicente Prado mentiu sobre a ida à farmácia: o ponto biométrico registrou seu crachá na oficina às 09h22 e o ticket mostrou que ele só foi à farmácia às 09h42 (E3). Mais intrigante ainda: o cartão "T.T.T.S." sugere que alguém maior está comprando peças raras na madrugada.',
                wrongEndings: {
                    elena: {
                        title: 'Prisão Injusta na Vitrine',
                        text: 'Você algemou Elena na frente dos clientes, mas a fita da câmera (E2) provou em minutos que ela nunca saiu do balcão. Enquanto a corregedoria revogava o mandado, Vicente desapareceu levando o cronômetro para o misterioso contato T.T.T.S.'
                    },
                    paulo: {
                        title: 'Pista Fria no Trânsito',
                        text: 'Você deteve o entregador Paulo, mas o dono do café da esquina confirmou sua presença lá às 09h24 (E1). Vicente aproveitou a confusão, limpou seu armário e fugiu antes do anoitecer.'
                    },
                    _partial: {
                        title: 'Mandado Tecnicamente Frágil',
                        text: 'Você identificou o culpado certo, mas errou a prova ou o método no documento da promotoria! Revise o registro biométrico E3 para fechar o caso sem brechas.'
                    },
                    _default: {
                        title: 'Inquérito Anulado',
                        text: 'As provas anexadas não sustentam a acusação. Revise a planta baixa e confronte o suspeito que realmente mentiu sobre o horário.'
                    }
                }
            }
        },

        /* ===================== CASO 1 ===================== */
        {
            id: 'caso-01',
            order: 1,
            act: 'Ato I — Fios Soltos',
            isTutorial: false,
            unlockRequires: null,
            code: 'DOSSIÊ #01-482',
            title: 'O Último Brinde do Antiquário',
            difficulty: 'Dificuldade: Moderada',
            victim: 'Arthur Vasconcelos (62 anos, dono da galeria Relíquias Vasconcelos)',
            location: 'Escritório particular (2º andar), Galeria Vasconcelos',
            timeOfDeath: 'Entre 21h15 e 21h45 (relógio de bolso quebrado às 21h32)',
            crimeWindowLabel: 'JANELA DA MORTE: 21h15 – 21h45 (Impacto exato às 21h32)',
            summary:
                'Durante um coquetel fechado para apresentar o raríssimo "Cronômetro Imperial", Arthur recolheu-se ao escritório às 21h00. Às 22h00, sua secretária encontrou-o morto sobre a escrivaninha, com uma taça de uísque pela metade. O cofre estava aberto, mas o Cronômetro permanecia intacto — apenas uma nota promissória desapareceu. A perícia confirmou envenenamento fulminante.',
            hotspots: [
                {
                    id: 'desk',
                    x: 195, y: 105,
                    label: 'Escrivaninha & Corpo',
                    detail: 'Arthur caiu às 21h32. Sobre o arquivo contábil está a nota fiscal de insumos (E2) e um lembrete de Clara: "Terminal travado — senha = horário em que digitei o rascunho (1940)".',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'safe',
                    x: 345, y: 78,
                    label: 'Cofre & Terminal de Denúncia',
                    detail: 'O cofre teve apenas a promissória de Beatriz levada, mas o terminal oculto de Arthur guarda o Rascunho de Denúncia protegido por senha de 4 dígitos (horário citado na escrivaninha: 19h40).',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-01',
                        type: 'keypad',
                        title: 'Terminal Criptografado de Arthur',
                        prompt: 'Informe os 4 dígitos do horário (HHMM) em que o documento confidencial foi digitado por Clara.',
                        clueRef: 'Inspecione a Escrivaninha (ponto 1) ou pergunte a Clara sobre o rascunho das 19h40.',
                        answer: '1940',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'door',
                    x: 110, y: 210,
                    label: 'Porta, Tapete & Rua',
                    detail: 'Cinzas de cigarro perto do batente e um lenço "B.V." sob o tapete (E4), além da gravação da câmera da padaria em frente (E7).',
                    unlocksEvidences: ['e4', 'e7']
                },
                {
                    id: 'stairs',
                    x: 350, y: 215,
                    label: 'Escada para Térreo e Subsolo',
                    detail: 'Liga o 2º andar ao laboratório blindado do subsolo. Você recolhe o Log do Leitor Magnético (E5).',
                    unlocksEvidences: ['e5']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 270" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="270" fill="#152028"/>
                    <g stroke="#29404f" stroke-width="0.6">
                        <path d="M0 30H440M0 60H440M0 90H440M0 120H440M0 150H440M0 180H440M0 210H440M0 240H440"/>
                        <path d="M40 0V270M80 0V270M120 0V270M160 0V270M200 0V270M240 0V270M280 0V270M320 0V270M360 0V270M400 0V270"/>
                    </g>
                    <rect x="35" y="30" width="370" height="210" fill="rgba(40,68,85,0.22)" stroke="#88b8d0" stroke-width="3"/>
                    <rect x="145" y="75" width="100" height="52" rx="3" fill="#253b4a" stroke="#7cb0c9" stroke-width="1.8"/>
                    <text x="195" y="105" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="10">ESCRIVANINHA</text>
                    <rect x="320" y="50" width="58" height="46" fill="#253b4a" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="349" y="76" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">COFRE/PC</text>
                    <rect x="65" y="175" width="95" height="50" fill="rgba(180,95,80,0.2)" stroke="#c78b7d" stroke-dasharray="4 3"/>
                    <line x1="95" y1="240" x2="140" y2="240" stroke="#152028" stroke-width="5"/>
                    <path d="M95 240 A45 45 0 0 1 140 195" fill="none" stroke="#88b8d0" stroke-width="1.5" stroke-dasharray="3 3"/>
                    <text x="115" y="255" text-anchor="middle" fill="#88b8d0" font-family="monospace" font-size="9">PORTA PRINCIPAL</text>
                    <rect x="305" y="175" width="90" height="60" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <line x1="320" y1="175" x2="320" y2="235" stroke="#5c8ea6" stroke-width="1.2"/>
                    <line x1="335" y1="175" x2="335" y2="235" stroke="#5c8ea6" stroke-width="1.2"/>
                    <line x1="350" y1="175" x2="350" y2="235" stroke="#5c8ea6" stroke-width="1.2"/>
                    <line x1="365" y1="175" x2="365" y2="235" stroke="#5c8ea6" stroke-width="1.2"/>
                    <line x1="380" y1="175" x2="380" y2="235" stroke="#5c8ea6" stroke-width="1.2"/>
                    <text x="350" y="168" text-anchor="middle" fill="#88b8d0" font-family="monospace" font-size="9">ESCADA (SUBSOLO)</text>
                    <line x1="150" y1="30" x2="250" y2="30" stroke="#c7e6f5" stroke-width="4"/>
                    <text x="200" y="22" text-anchor="middle" fill="#88b8d0" font-family="monospace" font-size="9">JANELA TRANCADA</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'beatriz',
                    name: 'Beatriz Vasconcelos',
                    age: 31,
                    role: 'Sobrinha e herdeira',
                    profile: 'Ambiciosa, acumula dívidas de cartão e dependia financeiramente do tio.',
                    statement:
                        'Fiquei no salão do coquetel até às 21h20. Como estava entediada, saí para a calçada às 21h25 para fumar e ligar para meu namorado, voltando só às 21h45. Eu jamais subi ao escritório do tio Arthur ontem à noite!',
                    alibi: 'Diz ter permanecido no salão até 21h20 e na calçada em frente das 21h25 às 21h45.',
                    portrait: 'woman_scarf',
                    questions: [
                        { id: 'q1', q: 'Qual era sua relação atual com seu tio?', a: 'Ele era controlador. Ameaçou cortar minha mesada se eu não pagasse uma nota promissória de R$ 40 mil até o fim do mês, mas eu nunca mataria meu próprio tio por isso.', mood: 'nervous' },
                        { id: 'q2', q: 'Alguém pode confirmar que você esteve fora do prédio durante o crime?', a: 'Meu namorado! Ficamos quase meia hora ao telefone. E eu fiquei bem embaixo da marquise da padaria em frente por causa do chuvisco.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Beatriz empalidece ao ver o lenço com suas iniciais: "Tudo bem, eu menti sobre não ter subido! Subi às 21h10 para implorar por mais prazo. Quando tio Arthur foi lavar as mãos no lavabo, abri o cofre — eu sabia a senha — e peguei minha promissória. Ele percebeu, brigamos, eu derrubei o cinzeiro e saí batendo a porta às 21h18. Mas ele estava vivíssimo! E, enquanto eu descia a escada às 21h18, cruzei com o Dr. Henrique subindo ao 2º andar limpando uma mancha azul dos dedos!"',
                            unlocksEvidenceId: 'e8',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Beatriz dá de ombros: "Isso não tem absolutamente nada a ver comigo, detetive. Procure em outro lugar."',
                    wrongMood: 'furious'
                },
                {
                    id: 'henrique',
                    name: 'Dr. Henrique Alencar',
                    age: 48,
                    role: 'Restaurador-chefe e químico',
                    profile: 'Perfeccionista, reservado e especialista em galvanoplastia de metais antigos.',
                    statement:
                        'Saí do coquetel às 20h58 para terminar a restauração de um cálice de prata no laboratório do subsolo. Não saí de lá nem por um segundo até às 21h50, quando subi para guardar o equipamento. Nunca entrei no escritório do Arthur ontem.',
                    alibi: 'Afirma ter ficado trancado no laboratório do subsolo ininterruptamente das 20h58 às 21h50.',
                    portrait: 'man_glasses',
                    questions: [
                        { id: 'q1', q: 'O senhor tem acesso a substâncias tóxicas no laboratório?', a: 'Apenas solventes comuns e cera de polimento. Nada que possa envenenar alguém num piscar de olhos.', mood: 'calm' },
                        { id: 'q2', q: 'Como era sua relação profissional com Arthur?', a: 'Impecável. Trabalhamos juntos há oito anos. Ele confiava cegamente no meu selo de autenticidade.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response:
                                'Henrique ajeita os óculos com nervosismo: "Ah, essa nota fiscal... Sim, eu compro cianeto de potássio para banho eletrolítico de prata antiga, é procedimento padrão de restauro! E uso pasta azul para polir. Mas isso não prova nada — eu não saí do subsolo!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'nervous'
                        },
                        {
                            evidenceId: 'e5',
                            response:
                                'O rosto de Henrique congela diante do relatório eletrônico: "O leitor... registrou saída às 21h16?! Bem, o banheiro do subsolo estava entupido e eu subi rapidamente ao térreo! Não fui ao escritório!" (Nota da Perícia: o banheiro do subsolo funciona perfeitamente.)',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Henrique fecha o punho sobre a mesa: "Arthur não entendia nada de química! Ele ia destruir minha carreira inteira só por eu vender três mecanismos para O Tambor! Mas sem provas de que saí do subsolo, você não tem nada contra mim!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Henrique mantém a frieza: "Interessante, detetive, mas isso não contradiz meu depoimento."',
                    wrongMood: 'calm'
                },
                {
                    id: 'clara',
                    name: 'Clara Mendes',
                    age: 39,
                    role: 'Secretária pessoal',
                    profile: 'Organizada, leal a Arthur há 12 anos. Foi quem encontrou o corpo às 22h00.',
                    statement:
                        'Fiquei na recepção do térreo organizando as fichas dos compradores das 21h00 às 21h55. Conversei com dois clientes que saíram às 21h35. Quando subi às 22h00 com o fechamento do caixa, encontrei o Sr. Arthur caído.',
                    alibi: 'Permaneceu na recepção do térreo; dois clientes confirmaram sua presença até 21h35.',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'O Sr. Arthur parecia preocupado antes do coquetel?', a: 'Muito. Na tarde de ontem ele examinou um laudo externo e me pediu para digitar um documento sigiloso exatamente às 19h40 antes dos convidados chegarem.', mood: 'nervous' },
                        { id: 'q2', q: 'Você viu alguém subindo as escadas após as 21h00?', a: 'Da minha mesa eu só vejo a porta da rua. A escada dos fundos que dá para o 2º andar e para o subsolo fica atrás da divisória.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e6',
                            response:
                                'Clara suspira, aliviada por poder falar: "Sim, fui eu quem digitou esse rascunho às 19h40. O Sr. Arthur descobriu que o Dr. Henrique estava trocando mecanismos originais por réplicas baratas e vendendo os autênticos para um comprador codinome O Tambor — ligado ao grupo T.T.T.S."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Clara examina o documento com atenção: "Sinto muito, detetive, não sei como posso ajudar com isso."',
                    wrongMood: 'calm'
                },
                {
                    id: 'marcos',
                    name: 'Marcos Tavares',
                    age: 55,
                    role: 'Colecionador rival',
                    profile: 'Temperamento explosivo; queria comprar o Cronômetro Imperial abaixo do valor.',
                    statement:
                        'Eu briguei feio com o Arthur às 20h40 na frente de todo mundo porque ele me chamou de picareta! Saí daquela galeria espumando de raiva às 20h55 e fui direto jantar no Bistrô Central. Não pisei mais lá!',
                    alibi: 'Afirma ter saído às 20h55 e jantado no Bistrô Central (a 4 km) das 21h10 às 21h55.',
                    portrait: 'man_hat',
                    questions: [
                        { id: 'q1', q: 'Você ameaçou o Arthur durante a briga?', a: 'Eu disse "você vai se arrepender de fechar negócios comigo", o que é força de expressão! Eu compro antiguidades, não enveneno velhos teimosos.', mood: 'furious' },
                        { id: 'q2', q: 'Como você prova que estava no Bistrô Central?', a: 'Paguei a conta no cartão e ainda bati boca com o garçom porque o vinho estava quente. Pode checar o recibo.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Marcos sorri triunfante: "Viu só? Pedido às 21h12, pagamento presencial às 21h55, a 15 minutos de carro da galeria. A menos que eu saiba me teletransportar, eu não estava lá às 21h32!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Marcos bufa impaciente: "Não tenho nada a ver com isso, detetive. Meu advogado já foi avisado."',
                    wrongMood: 'furious'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Necroscópico e Toxicológico',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame do IML realizado na vítima e na taça de cristal sobre a escrivaninha.',
                    doc: 'CAUSA DA MORTE: Envenenamento agudo por Cianeto de Potássio dissolvido no uísque.\nHORA ESTIMADA: 21h15 a 21h45 (relógio de bolso quebrado na queda às 21h32).\nVESTÍGIO FÍSICO: Resíduo de pasta azul de polimento de prata (óxido de cromo) no gargalo da garrafa de uísque.'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Nota Fiscal — Química Industrial',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'desk',
                    desc: 'Fatura encontrada sobre a escrivaninha no arquivo contábil da galeria, emitida há 14 dias.',
                    doc: 'COMPRADOR: Dr. Henrique Alencar (Restauro)\nITENS:\n- 500g Cianeto de Potássio P.A. (banho de prata)\n- 2x Pasta de Polimento Azul (Óxido de Cromo)\nSTATUS: Entregue no Laboratório do Subsolo.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Recibo Fiscal — Bistrô Central',
                    type: 'receipt',
                    initial: true,
                    desc: 'Comprovante obtido com o gerente do restaurante localizado a 4 km (15 min de carro) da galeria.',
                    doc: 'CLIENTE: Marcos Tavares\nABERTURA DA MESA: 21h12\nPAGAMENTO PRESENCIAL (ASSINADO): 21h55\nOBS. DO GERENTE: Cliente não deixou o salão durante o jantar.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Lenço de Seda "B.V."',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'door',
                    desc: 'Recolhido parcialmente escondido sob o tapete, junto a cinzas de cigarro perto da porta do escritório.',
                    doc: 'OBJETO: Lenço feminino de seda bordô com monograma bordado "B.V.".\nLOCAL: 2º andar, escritório da vítima.\nOBS.: Forte odor de cigarro mentolado.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Log do Leitor Magnético (Subsolo)',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'stairs',
                    desc: 'Registro eletrônico automático da porta blindada do laboratório de restauração no subsolo.',
                    doc: 'CARTÃO #04 — DR. HENRIQUE ALENCAR\n20h58 -> ENTRADA no Subsolo\n21h16 -> SAÍDA do Subsolo\n21h38 -> RETORNO ao Subsolo\n21h51 -> SAÍDA definitiva'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Rascunho de Denúncia (Terminal PC)',
                    type: 'message',
                    initial: false,
                    foundAtHotspot: 'safe',
                    desc: 'Documento desbloqueado no terminal criptografado (19h40), ditado por Arthur.',
                    doc: 'PARA: Delegacia de Estelionato e Patrimônio\nASSUNTO: Fraude na Galeria Vasconcelos\nTEXTO: "Comunico que o restaurador-chefe substituiu mecanismos autênticos por falsificações e repassou as peças originais ao comprador codinome O Tambor (rede T.T.T.S.). Protocolarei os laudos amanhã."'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Câmera Externa — Padaria em Frente',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'door',
                    desc: 'Gravação da câmera de segurança da padaria voltada para a calçada da galeria.',
                    doc: 'REGISTRO DE VÍDEO (CALÇADA FRONTAL):\n21h22 -> Beatriz Vasconcelos sai pela porta principal fumando e falando ao celular.\n21h22 às 21h46 -> Permanece sob a marquise em tempo integral.\n21h46 -> Retorna ao interior da galeria.'
                },
                {
                    id: 'e8',
                    code: 'E8',
                    title: 'Testemunho da Escada (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Confissão obtida após confrontar Beatriz com o lenço de seda (E4).',
                    doc: 'DEPOIMENTO COMPLEMENTAR — BEATRIZ:\n- Subiu às 21h10, pegou sua promissória no cofre e discutiu com Arthur.\n- Saiu do escritório às 21h18 (Arthur estava vivo).\n- Às 21h18, cruzou com Dr. Henrique subindo ao 2º andar limpando uma pasta azul dos dedos.'
                }
            ],
            timeline: [
                { time: '19h40', text: 'Arthur dita à secretária Clara uma denúncia formal de fraude contra o restaurador.', source: 'Evidência E6', requiresEvidence: 'e6', crimeWindow: false },
                { time: '20h40', text: 'Marcos Tavares discute publicamente com Arthur no coquetel.', source: 'Depoimento', crimeWindow: false },
                { time: '20h55', text: 'Marcos deixa a galeria furioso.', source: 'Depoimento', crimeWindow: false },
                { time: '20h58', text: 'Dr. Henrique entra no laboratório do subsolo com seu cartão magnético.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: false },
                { time: '21h10', text: 'Beatriz sobe ao escritório, retira sua nota promissória do cofre e discute com o tio.', source: 'Evidência E8 (Oculta)', requiresEvidence: 'e8', crimeWindow: false },
                { time: '21h12', text: 'Marcos abre mesa no Bistrô Central (a 4 km da galeria).', source: 'Evidência E3', crimeWindow: false },
                { time: '21h16', text: 'Cartão do Dr. Henrique registra SAÍDA do laboratório do subsolo.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '21h18', text: 'Beatriz deixa Arthur vivo e cruza com Dr. Henrique subindo a escada limpando pasta azul dos dedos.', source: 'Evidência E8 (Oculta)', requiresEvidence: 'e8', crimeWindow: true },
                { time: '21h22', text: 'Câmera da padaria grava Beatriz na calçada ao celular (fica lá até 21h46).', source: 'Evidência E7', requiresEvidence: 'e7', crimeWindow: true },
                { time: '21h32', text: 'Relógio de bolso de Arthur quebra na queda sobre a mesa (momento da morte por cianeto).', source: 'Evidência E1', crimeWindow: true },
                { time: '21h38', text: 'Cartão do Dr. Henrique registra RETORNO ao laboratório do subsolo.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '21h55', text: 'Marcos paga a conta pessoalmente no Bistrô Central.', source: 'Evidência E3', crimeWindow: false },
                { time: '22h00', text: 'Clara sobe com o fechamento do caixa e encontra o corpo.', source: 'Relatório Inicial', crimeWindow: false }
            ],
            keyConnections: [
                { from: 'suspect:henrique', to: 'evidence:e5', relation: 'contradiz', insight: 'O Log Magnético (21h16–21h38) desmente o álibi de Henrique no subsolo.' },
                { from: 'suspect:henrique', to: 'evidence:e6', relation: 'motivo', insight: 'A denúncia sobre fraude e vendas para O Tambor era o motivo do crime.' },
                { from: 'suspect:beatriz', to: 'evidence:e4', relation: 'contradiz', insight: 'O lenço B.V. prova que Beatriz subiu ao escritório antes do crime.' },
                { from: 'suspect:beatriz', to: 'evidence:e7', relation: 'confirma', insight: 'A câmera da padaria às 21h22–21h46 inocenta Beatriz do assassinato.' }
            ],
            hints: [
                'Nível 1 (Sutil): Dois suspeitos estão mentindo sobre onde estiveram. Um deles esconde um furto menor, mas tem uma gravação externa provando sua inocência às 21h32.',
                'Nível 2 (Direcionada): Inspecione todos os 4 pontos da planta (senha do terminal: 1940), confronte Beatriz com E4 e compare o vestígio azul (E1) com E2 e E5.',
                'Nível 3 (Conclusiva): Dr. Henrique tinha motivo (E6), o cianeto e a pasta azul (E2). O Log do Leitor Magnético (E5) destrói seu álibi entre 21h16 e 21h38.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'cyanide_whisky', label: 'Envenenamento por cianeto de potássio dissolvido no uísque' },
                    { id: 'blunt_force', label: 'Golpe contundente na testa com o cinzeiro de latão' },
                    { id: 'gas_leak', label: 'Asfixia por gás tóxico liberado pelo sistema de ventilação' },
                    { id: 'heart_attack', label: 'Infarto natural provocado pela discussão sobre a dívida' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Log do Leitor Magnético do Subsolo (saída às 21h16, retorno às 21h38)' },
                    { id: 'e4', label: 'E4 — Lenço de Seda com monograma "B.V." encontrado no escritório' },
                    { id: 'e3', label: 'E3 — Recibo Fiscal do Bistrô Central' },
                    { id: 'e7', label: 'E7 — Câmera Externa da Padaria em Frente' }
                ]
            },
            solution: {
                culpritId: 'henrique',
                methodId: 'cyanide_whisky',
                alibiBreakerId: 'e5',
                syndicateClue: 'Dr. Henrique repassava mecanismos de relógios raros para o comprador "O Tambor", célula cultural da rede T.T.T.S.',
                explanation:
                    'Arthur descobriu que o Dr. Henrique Alencar falsificava antiguidades da galeria para vendê-las a "O Tambor" e preparou uma denúncia formal (E6). Embora Beatriz tenha mentido inicialmente (subiu às 21h10 para pegar sua nota promissória e deixou cair seu lenço E4), a câmera da padaria prova que ela ficou na calçada das 21h22 às 21h46 (E7), e Marcos estava no Bistrô Central (E3). O log magnético (E5) prova que Dr. Henrique deixou o subsolo às 21h16, envenenou Arthur às 21h32 deixando pasta azul na garrafa (E1, E2, E8) e retornou às 21h38.',
                wrongEndings: {
                    beatriz: {
                        title: 'Você Prendeu Uma Ladra, Mas o Assassino Fugiu!',
                        text: 'Beatriz confessou ter furtado a própria nota promissória, mas a câmera da padaria (E7) inocentou-a do homicídio horas depois. Enquanto o inquérito desmoronava, o Dr. Henrique Alencar limpou o laboratório, pegou um voo noturno com passaporte falso fornecido por "O Tambor" e fugiu do país!'
                    },
                    marcos: {
                        title: 'Mandado Barrado pelo Álibi do Bistrô',
                        text: 'A promotoria anulou a prisão de Marcos Tavares assim que o recibo assinado e as testemunhas do Bistrô Central (E3) confirmaram sua permanência lá às 21h32. Na mesma madrugada, Dr. Henrique desapareceu sem deixar rastros.'
                    },
                    clara: {
                        title: 'Erro Trágico contra Testemunha-Chave',
                        text: 'Prender a secretária leal destruiu a cooperação da galeria. Sem Clara para autenticar o rascunho de denúncia, o verdadeiro assassino destruiu os arquivos e evadiu-se.'
                    },
                    _partial: {
                        title: 'Verdadeiro Culpado, Prova Insuficiente',
                        text: 'Você acertou que Dr. Henrique matou Arthur, mas o tribunal rejeitou os detalhes técnicos do mandado! Verifique o veneno exato e o Log do Subsolo (E5) para selar a condenação.'
                    },
                    _default: {
                        title: 'Inquérito Contestado pela Promotoria',
                        text: 'A acusação apresentada não fecha as contradições da janela entre 21h15 e 21h45.'
                    }
                }
            }
        },

        /* ===================== CASO 2 ===================== */
        {
            id: 'caso-02',
            order: 2,
            act: 'Ato I — Fios Soltos',
            isTutorial: false,
            unlockRequires: null,
            code: 'DOSSIÊ #02-907',
            title: 'Morte no Expresso da Serra',
            difficulty: 'Dificuldade: Difícil',
            victim: 'Helena Duarte (44 anos, jornalista investigativa)',
            location: 'Cabine 04 (1ª Classe) — Trem Noturno Expresso da Serra',
            timeOfDeath: 'Entre 00h20 e 00h40 (durante o apagão de 00h25 a 00h35)',
            crimeWindowLabel: 'JANELA DA MORTE: 00h20 – 00h40 (Apagão proposital: 00h25 – 00h35)',
            summary:
                'Com o trem parado na serra por uma nevasca, um apagão atingiu a 1ª classe das 00h25 às 00h35 após desligarem o disjuntor no Vagão de Serviço. Quando a luz voltou, Helena Duarte foi encontrada morta na Cabine 04, trancada por chave eletrônica. Seu laptop desapareceu, mas seu celular corporativo bloqueado e um cartão SD reserva ficaram na cabine.',
            hotspots: [
                {
                    id: 'cab04',
                    x: 165, y: 85,
                    label: 'Cabine 04 (Cena do Crime)',
                    detail: 'Sem sinais de arrombamento: porta aberta às 00h27 pela Chave Mestra #02. Você recolhe uma abotoadura "R.F." (E4) e encontra o leitor do Cartão SD Reserva travado por PIN (dica no rascunho de Helena: ano do caso médico arquivado da Dra. Sofia — 2023).',
                    unlocksEvidences: ['e4'],
                    puzzle: {
                        id: 'puz-02',
                        type: 'phone_pin',
                        title: 'Cofre Digital / Leitor de Cartão SD',
                        prompt: 'Digite o PIN de 4 dígitos para descriptografar o backup investigativo de Helena.',
                        clueRef: 'Veja o perfil da Dra. Sofia Nogueira: ano do caso médico arquivado investigado por Helena.',
                        answer: '2023',
                        unlocksEvidences: ['e3']
                    }
                },
                {
                    id: 'cab06',
                    x: 275, y: 85,
                    label: 'Cabine 06 (Corredor & Fechaduras)',
                    detail: 'Você extrai o Log completo das Fechaduras Eletrônicas com bateria independente (E5) de todas as cabines.',
                    unlocksEvidences: ['e5']
                },
                {
                    id: 'service',
                    x: 375, y: 155,
                    label: 'Copa & Vagão de Serviço',
                    detail: 'Lixeira ao lado do disjuntor contém ampola fria de Succinilcolina e luva rasgada (E2). No armário está a auditoria da adega e o bilhete de dívida de Mateus (E7).',
                    unlocksEvidences: ['e2', 'e7']
                },
                {
                    id: 'restaurant',
                    x: 60, y: 155,
                    label: 'Vagão-Restaurante',
                    detail: 'O barman entrega a comanda assinada por três testemunhas provando onde o Senador esteve durante todo o apagão (E6).',
                    unlocksEvidences: ['e6']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#141d24"/>
                    <rect x="18" y="38" width="404" height="174" rx="14" fill="rgba(45,70,88,0.22)" stroke="#85b5cc" stroke-width="3"/>
                    <rect x="102" y="132" width="225" height="36" fill="rgba(133,181,204,0.12)" stroke="#537d91" stroke-dasharray="4 3"/>
                    <text x="215" y="154" text-anchor="middle" fill="#8bbad1" font-family="monospace" font-size="9">CORREDOR 1ª CLASSE</text>
                    <rect x="24" y="46" width="74" height="158" fill="#1e313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="61" y="118" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">VAGÃO</text>
                    <text x="61" y="131" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">RESTAUR.</text>
                    <rect x="102" y="46" width="54" height="82" fill="#1b2c37" stroke="#7cb0c9" stroke-width="1.4"/>
                    <text x="129" y="70" text-anchor="middle" fill="#9bc5d9" font-family="monospace" font-size="8">CAB. 02</text>
                    <text x="129" y="83" text-anchor="middle" fill="#6f9bb0" font-family="monospace" font-size="7">(Senador)</text>
                    <rect x="158" y="46" width="56" height="82" fill="rgba(158,27,27,0.32)" stroke="#d46363" stroke-width="2"/>
                    <text x="186" y="70" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="8">CAB. 04</text>
                    <text x="186" y="83" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="7">(VÍTIMA)</text>
                    <rect x="216" y="46" width="54" height="82" fill="#1b2c37" stroke="#7cb0c9" stroke-width="1.4"/>
                    <text x="243" y="70" text-anchor="middle" fill="#9bc5d9" font-family="monospace" font-size="8">CAB. 05</text>
                    <text x="243" y="83" text-anchor="middle" fill="#6f9bb0" font-family="monospace" font-size="7">(Lucas)</text>
                    <rect x="272" y="46" width="55" height="82" fill="#1b2c37" stroke="#7cb0c9" stroke-width="1.4"/>
                    <text x="299" y="70" text-anchor="middle" fill="#9bc5d9" font-family="monospace" font-size="8">CAB. 06</text>
                    <text x="299" y="83" text-anchor="middle" fill="#6f9bb0" font-family="monospace" font-size="7">(Dra. Sofia)</text>
                    <rect x="145" y="172" width="120" height="32" fill="#1b2c37" stroke="#7cb0c9" stroke-width="1.4"/>
                    <text x="205" y="191" text-anchor="middle" fill="#9bc5d9" font-family="monospace" font-size="8">CAB. 03 (D. Carmem)</text>
                    <rect x="331" y="46" width="85" height="158" fill="#23323b" stroke="#c99e32" stroke-width="1.6"/>
                    <text x="374" y="102" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="8">COPA &amp;</text>
                    <text x="374" y="114" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="8">DISJUNTOR</text>
                    <text x="374" y="128" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(Lixeira)</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'roberto',
                    name: 'Senador Roberto Farias',
                    age: 58,
                    role: 'Político investigado pela vítima',
                    profile: 'Influente, autoritário e alvo central da reportagem de Helena sobre propinas.',
                    statement:
                        'Sei que aquela jornalista estava tentando manchar minha honra, mas eu sequer cheguei perto da cabine dela! Saí da minha Cabine 02 às 00h15, fui ao Vagão-Restaurante tomar um conhaque e fiquei lá conversando com o barman até às 00h45.',
                    alibi: 'Esteve no Vagão-Restaurante das 00h15 às 00h45, inclusive durante todo o apagão.',
                    portrait: 'man_suit',
                    questions: [
                        { id: 'q1', q: 'O senhor sabia que Helena tinha um dossiê pronto contra o seu gabinete?', a: 'Rumores de imprensa sensacionalista! Eu resolvo minhas disputas nos tribunais, não em vagões escuros.', mood: 'furious' },
                        { id: 'q2', q: 'O senhor conhece a Dra. Sofia Nogueira?', a: 'Apenas de vista. A clínica onde ela trabalhava recebeu emendas parlamentares do meu estado em 2023, nada além disso.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'O Senador fecha a cara e abaixa a voz: "Droga... Está bem! Eu menti sobre não ter ido lá. Entrei na Cabine 04 às 00h05 para oferecer um acordo financeiro pelo silêncio dela. Ela me expulsou aos gritos às 00h12, e minha abotoadura deve ter se soltado! Fui direto para o Vagão-Restaurante às 00h15 — o barman e metade do vagão me viram lá até 00h45!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'O Senador cruza os braços com desprezo: "Isso não me incrimina em nada. Fale com minha assessoria."',
                    wrongMood: 'calm'
                },
                {
                    id: 'sofia',
                    name: 'Dra. Sofia Nogueira',
                    age: 37,
                    role: 'Médica anestesiologista (Cabine 06)',
                    profile: 'Fria, precisa e extremamente controlada. Sua carreira dependia do arquivamento de um caso médico de 2023.',
                    statement:
                        'Foi um choque terrível. Eu estava exausta do congresso, tomei um chá calmante e fui dormir na minha Cabine 06 às 23h40. Não abri minha porta em momento algum até às 00h50, quando a gritaria no corredor me acordou. E não carrego medicamentos controlados na bagagem.',
                    alibi: 'Afirma ter permanecido dormindo dentro da Cabine 06 das 23h40 às 00h50.',
                    portrait: 'woman_doctor',
                    questions: [
                        { id: 'q1', q: 'A senhora conhecia Helena Duarte antes desta viagem?', a: 'Apenas de nome, pela televisão. Nunca tivemos contato pessoal.', mood: 'calm' },
                        { id: 'q2', q: 'Como anestesiologista, a senhora reconhece os sintomas da Succinilcolina?', a: 'É um bloqueador neuromuscular potente, mas precisa ficar refrigerado e só existe em hospitais. Impossível alguém carregar isso casualmente num trem.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Os olhos de Sofia se arregalam por uma fração de segundo: "O leitor da Cabine 06 marcou saída às 00h22 e retorno às 00h37?! Deve ser defeito por causa do apagão... ou... talvez eu tenha saído brevemente ao corredor porque senti falta de ar! Mas não entrei na Cabine 04!" (Nota: o sistema eletrônico tem bateria própria e funciona com precisão de segundos.)',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e3',
                            response:
                                'Sofia cerra os dentes: "Esse prontuário de 2023 foi arquivado pelo conselho! Helena não tinha direito de arruinar minha vida nem expor os repasses da Holding T.T.T.S.! Mas isso não prova que entrei na cabine dela!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        },
                        {
                            evidenceId: 'e9',
                            response:
                                'Sofia desvia o olhar rapidamente: "A velha da Cabine 03 vive inventando histórias! Eu pedi gelo para uma compressa no tornozelo, não para ampolas!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Dra. Sofia responde com serenidade clínica: "Não vejo qualquer relação lógica entre isso e o meu depoimento."',
                    wrongMood: 'calm'
                },
                {
                    id: 'mateus',
                    name: 'Mateus Rocha',
                    age: 29,
                    role: 'Comissário da 1ª Classe',
                    profile: 'Nervoso, sobrecarregado e endividado com apostas esportivas. Portador da Chave Mestra #02.',
                    statement:
                        'Eu não saí da copa em nenhum momento entre meia-noite e 00h40! Minha Chave Mestra #02 ficou o tempo todo no bolso do meu paletó. Quando a luz caiu às 00h25, demorei uns minutos no escuro para achar a lanterna e religar o disjuntor às 00h35.',
                    alibi: 'Alega ter ficado na copa o tempo todo com a Chave Mestra #02 sob sua guarda.',
                    portrait: 'man_uniform',
                    questions: [
                        { id: 'q1', q: 'Mais alguém tinha cópia da Chave Mestra #02?', a: 'Não senhor! Cada vagão só tem uma mestra. A #02 é exclusiva minha.', mood: 'nervous' },
                        { id: 'q2', q: 'Você ouviu Helena viva antes do apagão?', a: 'Sim! Passei no corredor às 00h15 recolhendo bandejas e ouvi a voz dela ditando notas num gravador dentro da Cabine 04.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e7',
                            response:
                                'Mateus começa a suar frio e confessa: "Por favor, não conte ao gerente! Estou afundado em dívidas e às 00h19 saí da copa para esconder duas garrafas de champanhe na minha mala no vagão de carga — o maquinista até me viu lá às 00h26! Deixei meu paletó com a Chave Mestra #02 pendurado na copa. Quando voltei às 00h33 no escuro, vi uma mulher de sobretudo escuro voltando apressada para a Cabine 06 com um laptop prateado!"',
                            unlocksEvidenceId: 'e8',
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e5',
                            response:
                                'Mateus entra em pânico: "A Chave Mestra #02 abriu a Cabine 04 às 00h27?! Eu juro que não fui eu! Às 00h26 eu estava no vagão de carga — o maquinista me viu lá! Deixei meu paletó na copa às 00h19 para esconder champanhe e, quando voltei às 00h33, vi uma mulher entrando na Cabine 06 com um laptop prateado!"',
                            unlocksEvidenceId: 'e8',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Mateus engole em seco: "Eu só faço meu trabalho no vagão, detetive, não sei nada sobre isso."',
                    wrongMood: 'nervous'
                },
                {
                    id: 'lucas',
                    name: 'Lucas Almeida',
                    age: 33,
                    role: 'Fotógrafo e colega de Helena (Cabine 05)',
                    profile: 'Temperamental, discutiu com Helena no jantar sobre créditos da reportagem.',
                    statement:
                        'Briguei com ela no jantar às 21h30, não vou negar — ela queria tirar minha assinatura da matéria. Mas às 22h10 entrei na Cabine 05, coloquei fones de ouvido e fiquei editando fotos no meu notebook até a confusão às 00h48.',
                    alibi: 'Permaneceu trancado na Cabine 05 das 22h10 às 00h48 (confirmado pelo log eletrônico).',
                    portrait: 'man_beard',
                    questions: [
                        { id: 'q1', q: 'Você notou algo estranho pelo corredor ou pela parede da Cabine 04?', a: 'Estava com fone de cancelamento de ruído. Só soube o que houve quando abriram as portas gritando por um médico.', mood: 'calm' },
                        { id: 'q2', q: 'O que havia no laptop que roubaram da Helena?', a: 'A versão final da matéria com todos os anexos bancários e hospitalares. Mas ela sempre fazia backup num cartão SD pequeno.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Lucas aponta para a linha da Cabine 05: "Olha aí! Trancada às 22h10, próxima abertura só às 00h48. E meus arquivos RAW têm carimbo de edição salvos às 00h24, 00h28 e 00h33. Eu não saí daquela cabine."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Lucas balança a cabeça: "Cara, eu não tenho nada a ver com a morte dela. Estávamos no mesmo barco profissional."',
                    wrongMood: 'nervous'
                },
                {
                    id: 'carmem',
                    name: 'Dona Carmem Silveira',
                    age: 67,
                    role: 'Passageira insone (Cabine 03)',
                    profile: 'Observadora atenta, sofre de insônia e repara em cada detalhe do vagão.',
                    statement:
                        'Eu não prego o olho em trens. Pouco depois da meia-noite ouvi o Senador discutir na porta da Cabine 04. Depois, no meio da escuridão do apagão, ouvi passos leves no corredor, o bipe baixo da fechadura da Cabine 04 e, minutos depois, alguém correndo em direção ao fim do vagão.',
                    alibi: 'Ficou na Cabine 03 lendo; sem qualquer vínculo ou motivo contra a vítima.',
                    portrait: 'woman_elder',
                    questions: [
                        { id: 'q1', q: 'A senhora conseguiu identificar de quem eram os passos no apagão?', a: 'Não vi o rosto porque estava tudo escuro, mas eram passos firmes e leves de mulher com salto baixo — bem diferentes das botas pesadas do comissário.', mood: 'calm' },
                        { id: 'q2', q: 'Notou algum comportamento incomum entre os passageiros mais cedo?', a: 'No jantar tudo parecia calmo. Mas se o senhor me mostrar o que encontraram na lixeira do vagão, talvez eu me lembre de algum detalhe.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response:
                                'Dona Carmem leva a mão à boca ao ouvir que o veneno precisava de refrigeração: "Meu Deus! Agora me lembrei! Às 22h30 eu vi a Dra. Sofia no Vagão-Restaurante pedindo um saco de gelo picado ao garçom e guardando numa bolsinha térmica cinza!"',
                            unlocksEvidenceId: 'e9',
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Dona Carmem ajusta os óculos: "Hum, sobre isso infelizmente não vi nem ouvi nada, meu jovem."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Médico-Pericial',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame preliminar feito pelo médico legista acionado na estação de emergência.',
                    doc: 'CAUSA DA MORTE: Parada respiratória aguda por injeção de Succinilcolina atrás da orelha esquerda.\nHORA ESTIMADA: 00h20 a 00h40.\nOBSERVAÇÃO: Anestésico de ação fulminante. Exige conservação sob refrigeração (2°C a 8°C).'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Ampola & Luva na Lixeira do Serviço',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'service',
                    desc: 'Itens recolhidos na lixeira ao lado do painel de disjuntores do Vagão de Serviço.',
                    doc: 'ITENS: 1 ampola vazia de Succinilcolina (ainda fria ao toque) + 1 luva cirúrgica rasgada.\nLOCAL: A 1 metro do disjuntor desligado às 00h25.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Cartão SD Reserva (Desbloqueado)',
                    type: 'message',
                    initial: false,
                    foundAtHotspot: 'cab04',
                    desc: 'Descriptografado com PIN 2023 sob a poltrona da vítima.',
                    doc: 'MATÉRIA: "Dossiê Saúde & Trilhos"\n1) Propinas do Senador Roberto Farias em obras ferroviárias.\n2) PROVA DOCUMENTAL: Dra. Sofia Nogueira falsificou prontuário de óbito em 2023 na clínica financiada pela Holding T.T.T.S. para incriminar uma enfermeira.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Abotoadura de Ouro "R.F."',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'cab04',
                    desc: 'Encontrada no carpete ao pé da cama dentro da Cabine 04.',
                    doc: 'OBJETO: Abotoadura masculina em ouro 18k com brasão e iniciais "R.F.".\nPERTENCENTE A: Senador Roberto Farias.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Log das Fechaduras Eletrônicas',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'cab06',
                    desc: 'Memória interna (com bateria própria, imune ao apagão) das portas da 1ª Classe.',
                    doc: 'CABINE 04 (Helena): 00h12 aberta por dentro | 00h27 aberta por CHAVE MESTRA #02\nCABINE 05 (Lucas): 22h10 trancada | 00h48 aberta\nCABINE 06 (Dra. Sofia): 00h22 aberta por dentro | 00h37 aberta por CARTÃO SOFIA'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Comanda do Vagão-Restaurante',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'restaurant',
                    desc: 'Registro do barman e assinatura de três passageiros testemunhas.',
                    doc: 'CLIENTE: Senador Roberto Farias\nCHEGADA: 00h15 (3 doses de conhaque)\nPERMANÊNCIA: Permaneceu sentado no balcão central durante todo o apagão até 00h45.\nTESTEMUNHAS: Barman + 3 passageiros.'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Inventário da Adega & Bilhete de Dívida',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'service',
                    desc: 'Auditoria de emergência do trem + papel encontrado no armário de Mateus.',
                    doc: 'ADEGA: Faltam 2 garrafas de champanhe safra especial (retiradas após 00h00).\nBILHETE: "Mateus — R$ 4.000 de apostas vencem amanhã."\nOBS. MAQUINISTA: Viu Mateus no vagão de carga às 00h26.'
                },
                {
                    id: 'e8',
                    code: 'E8',
                    title: 'Confissão do Comissário (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtida após confrontar Mateus com a dívida/adega (E7) ou o log (E5).',
                    doc: 'DEPOIMENTO COMPLEMENTAR — MATEUS:\n- Saiu da copa às 00h19 deixando o paletó com a Chave Mestra #02 pendurado.\n- Confirmado pelo maquinista no vagão de carga às 00h26.\n- Ao retornar às 00h33 no escuro, viu uma mulher de sobretudo escuro entrando na Cabine 06 com um laptop prateado.'
                },
                {
                    id: 'e9',
                    code: 'E9',
                    title: 'Relato da Bolsa Térmica (Desbloqueado)',
                    type: 'photo',
                    secret: true,
                    desc: 'Lembrança de Dona Carmem após ver a ampola refrigerada (E2).',
                    doc: 'DEPOIMENTO COMPLEMENTAR — DONA CARMEM:\n- Às 22h30, viu Dra. Sofia pedir gelo picado ao garçom e guardá-lo em uma bolsa térmica cinza.'
                }
            ],
            timeline: [
                { time: '21h30', text: 'Lucas discute com Helena no jantar sobre créditos da reportagem.', source: 'Depoimento', crimeWindow: false },
                { time: '22h10', text: 'Lucas tranca-se na Cabine 05 (não abre até 00h48).', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: false },
                { time: '22h30', text: 'Dra. Sofia pede gelo picado e guarda numa bolsa térmica cinza.', source: 'Evidência E9 (Oculta)', requiresEvidence: 'e9', crimeWindow: false },
                { time: '00h05', text: 'Senador Roberto entra na Cabine 04 para tentar subornar Helena e derruba sua abotoadura.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: false },
                { time: '00h12', text: 'Cabine 04 é aberta por dentro (saída do Senador).', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: false },
                { time: '00h15', text: 'Mateus ouve Helena viva no gravador; Senador chega ao Vagão-Restaurante (fica até 00h45).', source: 'Evidência E6', requiresEvidence: 'e6', crimeWindow: false },
                { time: '00h19', text: 'Mateus deixa o paletó com a Chave Mestra #02 na copa e vai ao vagão de carga esconder champanhe.', source: 'Evidência E8 (Oculta)', requiresEvidence: 'e8', crimeWindow: false },
                { time: '00h22', text: 'Cabine 06 (Dra. Sofia) é aberta por dentro — contradizendo seu álibi de sono!', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '00h25', text: 'Disjuntor no Vagão de Serviço é desligado: início do apagão.', source: 'Relatório Inicial', crimeWindow: true },
                { time: '00h26', text: 'Maquinista vê Mateus no vagão de carga (longe da Cabine 04).', source: 'Evidência E7', requiresEvidence: 'e7', crimeWindow: true },
                { time: '00h27', text: 'Cabine 04 é aberta usando a Chave Mestra #02 (momento da injeção letal).', source: 'Evidência E5 & E1', requiresEvidence: 'e5', crimeWindow: true },
                { time: '00h33', text: 'Mateus retorna e vê mulher entrando na Cabine 06 com um laptop prateado.', source: 'Evidência E8 (Oculta)', requiresEvidence: 'e8', crimeWindow: true },
                { time: '00h35', text: 'Disjuntor é religado; fim do apagão.', source: 'Relatório Inicial', crimeWindow: true },
                { time: '00h37', text: 'Cabine 06 é aberta pelo cartão da Dra. Sofia.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:sofia', to: 'evidence:e5', relation: 'contradiz', insight: 'A saída às 00h22 e retorno às 00h37 destroem o álibi de sono da Dra. Sofia.' },
                { from: 'suspect:sofia', to: 'evidence:e3', relation: 'motivo', insight: 'O prontuário falsificado na clínica da Holding T.T.T.S. ameaçava prender Sofia.' },
                { from: 'suspect:mateus', to: 'evidence:e7', relation: 'contradiz', insight: 'Mateus saiu para esconder champanhe, deixando a Chave Mestra vulnerável.' },
                { from: 'suspect:roberto', to: 'evidence:e6', relation: 'confirma', insight: 'A comanda e 4 testemunhas garantem o álibi do Senador durante o apagão.' }
            ],
            hints: [
                'Nível 1 (Sutil): Três pessoas mentem neste trem! O Senador esconde suborno (mas tem testemunhas no apagão) e o Comissário esconde furto de bebidas (visto às 00h26 no vagão de carga).',
                'Nível 2 (Direcionada): Decifre o Cartão SD na Cabine 04 com 2023, pegue E5 na Cabine 06 e confronte Mateus (E7) e Dona Carmem (E2).',
                'Nível 3 (Conclusiva): Dra. Sofia tinha motivo fatal (E3), acesso ao anestésico refrigerado (E1, E2, E9) e seu álibi é destruído pelo Log das Fechaduras (E5).'
            ],
            accusationOptions: {
                methods: [
                    { id: 'succinylcholine', label: 'Injeção letal de Succinilcolina atrás da orelha durante o apagão' },
                    { id: 'suffocation', label: 'Asfixia mecânica com travesseiro após arrombamento da janela' },
                    { id: 'poison_wine', label: 'Envenenamento por sedativo misturado ao conhaque do restaurante' },
                    { id: 'electrocution', label: 'Choque elétrico provocado pelo curto-circuito do disjuntor' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Log das Fechaduras Eletrônicas (saída da Cabine 06 às 00h22 e retorno às 00h37)' },
                    { id: 'e4', label: 'E4 — Abotoadura de Ouro "R.F." encontrada perto da cama' },
                    { id: 'e6', label: 'E6 — Comanda e Testemunho do Vagão-Restaurante' },
                    { id: 'e7', label: 'E7 — Inventário da Adega e Bilhete de Dívida' }
                ]
            },
            solution: {
                culpritId: 'sofia',
                methodId: 'succinylcholine',
                alibiBreakerId: 'e5',
                syndicateClue: 'A clínica de Sofia servia de fachada financeira para a misteriosa Holding T.T.T.S.',
                explanation:
                    'Helena ia publicar provas de que a Dra. Sofia Nogueira falsificou um prontuário de óbito em 2023 na clínica financiada pela Holding T.T.T.S. (E3). O Senador foi à Cabine 04 às 00h05 (E4), mas ficou no Restaurante das 00h15 às 00h45 (E6). Mateus furtou champanhe, mas estava no vagão de carga às 00h26 (E7, E8). Dra. Sofia saiu da Cabine 06 às 00h22 (E5), pegou a chave mestra de Mateus, desligou o disjuntor, aplicou a injeção letal refrigerada em gelo (E1, E2, E9), roubou o laptop e retornou às 00h37.',
                wrongEndings: {
                    mateus: {
                        title: 'Você Prendeu o Ladrão de Champanhe!',
                        text: 'Mateus confessou imediatamente o furto das duas garrafas da adega, mas o testemunho do maquinista que o viu às 00h26 no vagão de carga derrubou a acusação de homicídio. Na parada de emergência da serra, Dra. Sofia desembarcou tranquilamente em uma ambulância particular enviada pela Holding T.T.T.S. e fugiu do país!'
                    },
                    roberto: {
                        title: 'Imunidade Blindada pelo Álibi',
                        text: 'O Senador confessou a tentativa de suborno, mas quatro testemunhas no Vagão-Restaurante (E6) destruíram sua tese de homicídio. O escândalo derrubou sua investigação enquanto o verdadeiro mandante do crime seguia livre.'
                    },
                    lucas: {
                        title: 'Acusação Anulada pelos Metadados',
                        text: 'Os arquivos RAW de Lucas e o log contínuo da Cabine 05 (E5) comprovaram que ele nunca saiu de lá durante o apagão. A assassina aproveitou o atraso para sumir com o laptop.'
                    },
                    carmem: {
                        title: 'Detenção Injusta de Testemunha',
                        text: 'Prender a idosa insone que ouviu os passos no corredor desfez a última pista presencial sobre a bolsa térmica. O caso esfriou naquela mesma noite.'
                    },
                    _partial: {
                        title: 'Culpada Certa, Falha Técnica no Mandado',
                        text: 'Você identificou Dra. Sofia, mas o juiz exigiu o método exato (Succinilcolina) e o Log das Fechaduras (E5) que prova sua saída às 00h22.'
                    },
                    _default: {
                        title: 'Inquérito Contestado na Ferrovia',
                        text: 'O mandado falhou em cruzar os horários da janela do apagão (00h25–00h35).'
                    }
                }
            }
        },

        /* ===================== CASO 3 ===================== */
        {
            id: 'caso-03',
            order: 3,
            act: 'Ato II — A Marca da Madeira',
            isTutorial: false,
            unlockRequires: 'caso-01',
            code: 'DOSSIÊ #03-331',
            title: 'Silêncio no Cais 09',
            difficulty: 'Dificuldade: Difícil',
            victim: 'Capitão Augusto Ferraz (54 anos, chefe da Alfândega Portuária)',
            location: 'Galpão 09 — Zona Alfandegária do Porto',
            timeOfDeath: '03h33 (relógio de pátio parou após impacto elétrico no quadro)',
            crimeWindowLabel: 'JANELA DA MORTE: 03h20 – 03h40 (Três batidas metálicas ouvidas às 03h33)',
            summary:
                'Às 03h33 da madrugada, três batidas pesadas ecoaram pelo Galpão 09 como um tambor de madeira oca. Minutos depois, o Capitão Augusto Ferraz foi encontrado morto ao lado do contêiner #77 com um trauma na nuca compatível com madeira maciça de teca. A carga lacrada sumiu e uma caixa cifrada ficou presa na empilhadeira.',
            hotspots: [
                {
                    id: 'container',
                    x: 155, y: 105,
                    label: 'Contêiner #77 & Corpo',
                    detail: 'Farpas de madeira de teca escura e graxa de guindaste no chão (E2). O lacre alfandegário foi cortado com alicate hidráulico.',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'forklift',
                    x: 315, y: 100,
                    label: 'Caixa Cifrada na Empilhadeira',
                    detail: 'Maleta blindada com cifra de César (+1 letra). No painel lê-se: "SENHA CRIPTOGRAFADA: TBIVS (Desloque 1 letra para trás no alfabeto)".',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-03',
                        type: 'cipher',
                        title: 'Decifrador de Cifra T.T.T.S.',
                        prompt: 'Decifre a palavra-chave de 5 letras deslocando cada letra de "TBIVS" uma posição para trás (A<-B).',
                        clueRef: 'T→S, B→A, I→H... Use o dial de deslocamento César abaixo para ler a palavra real.',
                        cipherText: 'TBIVS',
                        cipherHint: 'Deslocamento -1 (César)',
                        answer: 'SAHUR',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'guardhouse',
                    x: 95, y: 195,
                    label: 'Guarita de Ronda & Bastão',
                    detail: 'Você recolhe o Log do Bastão Eletrônico de Ronda de Bruno (E5) e o comprovante de pedágio rodoviário de Otto (E3).',
                    unlocksEvidences: ['e5', 'e3']
                },
                {
                    id: 'dockoffice',
                    x: 350, y: 205,
                    label: 'Escritório de Despacho',
                    detail: 'Notas frias de charutos contrabandeados escondidas na gaveta de Renata (E4).',
                    unlocksEvidences: ['e4']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#131c24"/>
                    <rect x="24" y="24" width="392" height="202" fill="rgba(40,68,85,0.2)" stroke="#88b8d0" stroke-width="2.5"/>
                    <rect x="75" y="58" width="160" height="80" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="155" y="88" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">CONTÊINER #77</text>
                    <text x="155" y="102" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Corpo do Capitão)</text>
                    <rect x="265" y="58" width="110" height="72" fill="#23323b" stroke="#c99e32" stroke-width="1.6"/>
                    <text x="320" y="90" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">EMPILHADEIRA</text>
                    <text x="320" y="104" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(Caixa Cifrada)</text>
                    <rect x="45" y="162" width="110" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="100" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">GUARITA RONDA</text>
                    <rect x="290" y="162" width="115" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="348" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">DESPACHANTE</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'bruno',
                    name: 'Bruno Vasques',
                    age: 36,
                    role: 'Vigia noturno do Galpão 09',
                    profile: 'Ex-lutador, silencioso e orgulhoso de sua ronda impecável com bastão eletrônico.',
                    statement:
                        'Fiz a ronda externa no Pátio Leste das 03h00 às 03h45, batendo meu bastão nos sensores do muro lá fora a cada dez minutos. Nem entrei no Galpão 09 até o alarme disparar!',
                    alibi: 'Alega estar no Pátio Leste a 400m de distância batendo ponto nos sensores externos.',
                    portrait: 'man_beard',
                    questions: [
                        { id: 'q1', q: 'Você ouviu as três batidas às 03h33?', a: 'Ouvi um eco abafado vindo da água, achei que fosse navio manobrando.', mood: 'calm' },
                        { id: 'q2', q: 'Por que seu bastão de ronda tem peso extra na ponta?', a: 'Modelo padrão da firma, madeira tratada para espantar cães no cais.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Bruno trava o maxilar e sua frio: "O que?! O chip do bastão registrou dois pontos em lugares opostos no mesmo minuto?! Esse maldito equipamento clonou errado... Eu não devia ter confiado naquele técnico do Sahur!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Bruno cerra os punhos: "Quem te deu acesso ao manifesto da Sahur Importações?! O Capitão Ferraz ia apreender o carregamento antes da entrega da madrugada — ele não deixou escolha ao Sindicato!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Bruno cruza os braços: "Minha folha de ponto está limpa, detetive."',
                    wrongMood: 'calm'
                },
                {
                    id: 'renata',
                    name: 'Renata Campos',
                    age: 41,
                    role: 'Despachante aduaneira',
                    profile: 'Ambiciosa, desviava lotes menores de charutos sem declarar imposto.',
                    statement:
                        'Passei no meu escritório às 03h15 apenas para protocolar guias atrasadas e fui embora às 03h25 antes de qualquer confusão! Nunca me aproximei do Contêiner #77.',
                    alibi: 'Afirma ter ido embora às 03h25 após protocolar documentos.',
                    portrait: 'woman_scarf',
                    questions: [
                        { id: 'q1', q: 'O Capitão Ferraz fiscalizava suas guias?', a: 'Sim, ele era chato com papéis, mas eu resolvia pagando multas administrativas.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Renata empalidece e confessa: "Ok, ok! Eu estava no escritório até 03h30 escondendo faturas de caixas de charutos contrabandeados no meu carro! Mas quando saí pela porta dos fundos às 03h31, vi o vigia Bruno entrando no Galpão 09 com um porrete de teca escura e uma maleta!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Renata responde irritada: "Eu trabalho com papéis, não mato fiscais!"',
                    wrongMood: 'furious'
                },
                {
                    id: 'otto',
                    name: 'Otto Krieger',
                    age: 52,
                    role: 'Importador portuário',
                    profile: 'Frio, dono de duas empresas de logística ligadas ao porto.',
                    statement:
                        'Eu já estava na rodovia voltando para a capital desde 03h10! Só soube da morte do Capitão quando a polícia me ligou.',
                    alibi: 'Passou pela praça de pedágio da rodovia (a 28 km do porto) às 03h30.',
                    portrait: 'man_suit',
                    questions: [
                        { id: 'q1', q: 'Você conhecia o contêiner #77?', a: 'Era um lote de madeira nobre retido por burocracia. Nada que justifique violência.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Otto sorri confiante: "Foto e leitura automática da placa na cancela do pedágio às 03h30! É fisicamente impossível estar no Cais 09 às 03h33."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Otto olha no relógio: "Tenho álibi registrado em rodovia federal."',
                    wrongMood: 'calm'
                },
                {
                    id: 'nadia',
                    name: 'Nádia Oliveira',
                    age: 30,
                    role: 'Operadora de guindaste noturna',
                    profile: 'Trabalhava na cabine elevada a 18 metros de altura.',
                    statement:
                        'Da minha cabine eu vi lanternas mexendo perto do Contêiner #77 pouco depois das 03h30 e ouvi três batidas secas que pareciam um sinal.',
                    alibi: 'Estava na torre do guindaste (confirmado pela telemetria da cabine).',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'Conseguiu distinguir quem segurava a lanterna?', a: 'A neblina atrapalhava, mas se você me mostrar os vestígios achados perto do contêiner posso associar à pessoa.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response:
                                'Nádia arregala os olhos ao ver a graxa e as farpas de teca: "Essa graxa azul é só da trava da empilhadeira interna! E às 03h34 vi exatamente o uniforme de vigia do Bruno correndo da empilhadeira até a guarita — enquanto o sensor do Pátio Leste piscava sozinho!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Nádia balança a cabeça: "Lá de cima eu só via sombras e luzes, detetive."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Pericial do Cais',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame do corpo do Capitão Augusto Ferraz ao lado do Contêiner #77.',
                    doc: 'CAUSA DA MORTE: Trauma cranioencefálico severo na nuca provocado por bastão cilíndrico de madeira maciça (teca).\nHORA EXATA: 03h33.\nDETALHE: Três marcas espaçadas na caixa metálica ao lado, sugerindo três batidas rituais.'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Farpas de Teca & Graxa Azul',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'container',
                    desc: 'Vestígios coletados na cena do Contêiner #77.',
                    doc: 'AMOSTRA A: Farpas de madeira teca escura idêntica a porrete ritual.\nAMOSTRA B: Pegada com graxa azul da empilhadeira indo na direção da Guarita.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Registro Automático de Pedágio',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'guardhouse',
                    desc: 'Comprovante eletrônico e foto da praça rodoviária Km 28.',
                    doc: 'VEÍCULO DE OTTO KRIEGER: Passagem presencial na cancela automática às 03h30 (28 km do Porto).'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Notas Frias de Contrabando Menor',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'dockoffice',
                    desc: 'Faturas escondidas no fundo falso da gaveta da despachante Renata.',
                    doc: 'MERCADORIA: 12 caixas de charutos sem guia fiscal.\nHORÁRIO DE SAÍDA NA CÂMERA DO PORTÃO: Renata passou pelo portão de carros às 03h31.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Auditoria do Bastão Eletrônico (Clonado)',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'guardhouse',
                    desc: 'Leitura técnica do sistema de ronda da guarita de Bruno.',
                    doc: 'ALERTA DE FRAUDE:\n03h30 -> Tag do Pátio Leste lida pelo chip #B-99 (dispositivo clonado deixado em temporizador).\n03h33 -> Tag original de Bruno registrada a 12 metros do Contêiner #77 por antena Wi-Fi passiva!'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Manifesto "SAHUR IMPORTAÇÕES" (Decifrado)',
                    type: 'cipher',
                    initial: false,
                    foundAtHotspot: 'forklift',
                    desc: 'Desbloqueado na caixa cifrada TBIVS → SAHUR.',
                    doc: 'REMETENTE: Sahur Importações (Sindicato T.T.T.S.)\nCONTEÚDO DO CONTÊINER #77: Dardos neurotóxicos e cilindros de madeira teca.\nORDEM: "Silenciar o Capitão Ferraz às 03h33 caso tente abrir o lote. Pagamento ao vigia Bruno dobrado."'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Testemunho da Torre do Guindaste (Desbloqueado)',
                    type: 'photo',
                    secret: true,
                    desc: 'Relato complementar de Nádia ao reconhecer a graxa azul de E2.',
                    doc: 'DEPOIMENTO DE NÁDIA:\n- Viu Bruno correr do Contêiner #77 para a guarita às 03h34 com um bastão de madeira escuro, enquanto o sensor do Pátio Leste disparava sozinho.'
                }
            ],
            timeline: [
                { time: '03h10', text: 'Otto deixa o porto rumo à rodovia.', source: 'Depoimento', crimeWindow: false },
                { time: '03h25', text: 'Renata termina de esconder notas de charutos no escritório.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '03h30', text: 'Otto passa pelo pedágio a 28 km; dispositivo clonado forja ronda de Bruno no Pátio Leste.', source: 'Evidências E3 & E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '03h31', text: 'Renata sai pelo portão principal após ver Bruno entrando no galpão.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '03h33', text: 'Três batidas ressoam no cais; Capitão Ferraz é morto por golpe de madeira teca.', source: 'Evidência E1', crimeWindow: true },
                { time: '03h34', text: 'Nádia observa Bruno correndo com o bastão até a guarita.', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:bruno', to: 'evidence:e5', relation: 'contradiz', insight: 'A antena passiva mostra o crachá real de Bruno no Galpão 09 às 03h33 apesar da tag clonada!' },
                { from: 'suspect:bruno', to: 'evidence:e6', relation: 'motivo', insight: 'O manifesto SAHUR ordena o pagamento dobrado ao vigia Bruno.' },
                { from: 'suspect:otto', to: 'evidence:e3', relation: 'confirma', insight: 'O pedágio no Km 28 às 03h30 confirma o álibi de Otto.' }
            ],
            hints: [
                'Nível 1: Decifre a caixa na empilhadeira deslocando TBIVS 1 letra para trás (S-A-H-U-R) para revelar quem financiou o crime.',
                'Nível 2: Confronte Renata com E4 e Nádia com E2. Analise com atenção o log eletrônico do bastão de ronda (E5).',
                'Nível 3: Bruno clonou o bastão de ronda (E5) para forjar presença no Pátio Leste enquanto matava o Capitão com o porrete de madeira teca.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'wooden_club_blow', label: 'Golpe fatal na nuca com bastão de madeira teca e clonagem do sensor de ronda' },
                    { id: 'crane_drop', label: 'Queda acidental de carga operada pelo guindaste da torre' },
                    { id: 'cigar_poison', label: 'Asfixia por gás oculto nas caixas de charutos' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Auditoria do Bastão Eletrônico Clonado (chip no Galpão 09 às 03h33)' },
                    { id: 'e4', label: 'E4 — Notas Frias de Contrabando de Renata' },
                    { id: 'e3', label: 'E3 — Registro Automático de Pedágio' }
                ]
            },
            solution: {
                culpritId: 'bruno',
                methodId: 'wooden_club_blow',
                alibiBreakerId: 'e5',
                syndicateClue: 'A "Sahur Importações" contrabandeou dardos neurotóxicos e madeira teca ritual pelo Cais 09.',
                explanation:
                    'A carga retida no Contêiner #77 pertencia à Sahur Importações (E6). Otto estava a 28 km no pedágio às 03h30 (E3) e Renata apenas ocultava charutos contrabandeados, saindo às 03h31 (E4). Bruno instalou um chip clonado temporizado no Pátio Leste para forjar seu álibi, mas a antena passiva do Galpão 09 detectou sua tag real às 03h33 (E5) enquanto ele golpeava o Capitão com o bastão de teca (E1, E2, E7).',
                wrongEndings: {
                    renata: {
                        title: 'Contrabando Pego, Assassino Solto',
                        text: 'Renata assumiu o desvio de charutos, mas a câmera do portão mostrou sua saída às 03h31 — antes da morte às 03h33. Bruno escapou num barco rápido fretado pela Sahur Importações.'
                    },
                    otto: {
                        title: 'Mandado Rejeitado pela Rodoviária',
                        text: 'A foto do pedágio a 28 km (E3) provou em minutos que Otto não estava no cais. O Sindicato moveu o contêiner para fora do porto antes do amanhecer.'
                    },
                    nadia: {
                        title: 'Você Calou a Única Testemunha Ocular',
                        text: 'Com a operadora do guindaste detida injustamente, ninguém ligou a graxa azul da empilhadeira ao vigia Bruno, que sumiu no turno da manhã.'
                    },
                    _partial: {
                        title: 'Falta Precisão Técnica no Mandado',
                        text: 'Bruno é o assassino, mas o promotor exige o laudo do bastão de teca e a auditoria do sensor clonado (E5).'
                    },
                    _default: {
                        title: 'Inquérito Contestado no Porto',
                        text: 'Revise as provas do Cais 09 e a cifra da Sahur Importações.'
                    }
                }
            }
        },

        /* ===================== CASO 4 ===================== */
        {
            id: 'caso-04',
            order: 4,
            act: 'Ato II — Dinheiro de Madeira',
            isTutorial: false,
            unlockRequires: 'caso-02',
            code: 'DOSSIÊ #04-739',
            title: 'O Leilão das Sombras',
            difficulty: 'Dificuldade: Difícil',
            victim: 'Eduardo Motta (51 anos, auditor financeiro independente)',
            location: 'Sala VIP — Mansão Cristal (Leilão Beneficente)',
            timeOfDeath: '22h40 (parada cardíaca fulminante após taça na Sala VIP)',
            crimeWindowLabel: 'JANELA DA MORTE: 22h32 – 22h45 (Colapso às 22h40)',
            summary:
                'Durante o leilão de arte da Mansão Cristal, o auditor Eduardo Motta descobriu desvios milionários camuflados em lotes beneficentes. Às 22h40, tombou morto na Sala VIP após beber champanhe contaminado com alcaloide raro. Sua maleta executiva estava trancada por um cadeado de 3 discos e alguém apagou as gravações internas.',
            hotspots: [
                {
                    id: 'viproom',
                    x: 175, y: 100,
                    label: 'Sala VIP & Taça',
                    detail: 'Você coleta o Catálogo Oficial com três lotes marcados a lápis por Eduardo (*Lote 7*, *Lote 3* e *Lote 9*) (E2) e as fotos do fotógrafo oficial do evento (E5).',
                    unlocksEvidences: ['e2', 'e5']
                },
                {
                    id: 'briefcase',
                    x: 335, y: 95,
                    label: 'Maleta Trancada do Auditor',
                    detail: 'Cadeado mecânico de 3 discos. A nota no catálogo (E2) indica a combinação pelos números dos três lotes com asterisco (*).',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-04',
                        type: 'dial_lock',
                        title: 'Cadeado de 3 Discos da Maleta',
                        prompt: 'Gire os três discos até os números dos 3 lotes marcados com asterisco no Catálogo (E2).',
                        clueRef: 'Leia E2: os três lotes destacados por Eduardo formam uma sequência de 3 dígitos (7-3-9).',
                        answer: '739',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'stage',
                    x: 110, y: 195,
                    label: 'Púlpito de Leilão',
                    detail: 'Contrato adulterado onde a leiloeira Valéria inflou o preço de uma tela falsa (E4).',
                    unlocksEvidences: ['e4']
                },
                {
                    id: 'parking',
                    x: 345, y: 195,
                    label: 'Guarita do Estacionamento',
                    detail: 'Câmera da cancela e registro de acesso de Gabriel Soares (E3).',
                    unlocksEvidences: ['e3']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#171e24"/>
                    <rect x="26" y="24" width="388" height="202" fill="rgba(45,70,88,0.2)" stroke="#85b5cc" stroke-width="2.5"/>
                    <rect x="65" y="54" width="190" height="82" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="160" y="92" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">SALA VIP</text>
                    <text x="160" y="106" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Corpo de Eduardo)</text>
                    <rect x="278" y="54" width="112" height="82" fill="#23323b" stroke="#c99e32" stroke-width="1.6"/>
                    <text x="334" y="92" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">COFRE / MALETA</text>
                    <rect x="52" y="160" width="145" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="124" y="190" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">PÚLPITO LEILÃO</text>
                    <rect x="278" y="160" width="112" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="334" y="190" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">ESTACIONAMENTO</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'caio',
                    name: 'Prof. Caio Bernardes',
                    age: 49,
                    role: 'Curador e tesoureiro do leilão',
                    profile: 'Elegante, articulado e gestor secreto das contas offshore do leilão.',
                    statement:
                        'Passei a noite inteira no Salão Principal anunciando os lotes no microfone! Não entrei na Sala VIP nem uma única vez entre 22h00 e 23h00.',
                    alibi: 'Alega não ter deixado o Salão Principal em momento algum entre 22h00 e 23h00.',
                    portrait: 'man_glasses',
                    questions: [
                        { id: 'q1', q: 'Você conhecia as contas offshore ligadas aos lotes beneficentes?', a: 'Absurdo! São doações culturais legítimas, nunca ouvi falar de desvio.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'O rosto de Caio perde a cor diante da ampliação da foto: "O reflexo no espelho da Sala VIP às 22h38 mostra minha gravata vinho?! Droga... O fotógrafo pegou o espelho por trás! Mas sem motivo provado, você não prova que toquei naquela taça!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Caio range os dentes: "Como abriu a maleta?! Eduardo ia congelar a CONTA SAHUR-333 hoje à noite — o chefe jamais perdoaria um bloqueio antes do Tribunal!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Caio ajusta a gravata com desprezo: "Isso é irrelevante para a minha conduta impecável."',
                    wrongMood: 'calm'
                },
                {
                    id: 'valeria',
                    name: 'Valéria Monteiro',
                    age: 38,
                    role: 'Leiloeira-chefe',
                    profile: 'Carismática, mas forjou a procedência de um quadro menor para receber comissão dobrada.',
                    statement:
                        'Fui à Sala VIP às 22h20 rápido para recolher o contrato do lote falsificado antes do Eduardo conferir, mas saí às 22h25 enquanto ele ainda falava ao telefone! Nem toquei no champanhe.',
                    alibi: 'Deixou a Sala VIP às 22h25 e subiu ao camarim do 2º andar (visto por garçons).',
                    portrait: 'woman_scarf',
                    questions: [
                        { id: 'q1', q: 'Por que temia tanto a auditoria de Eduardo?', a: 'Eu inflei a avaliação de uma pintura de paisagem por ganância... mas veneno? Nunca!', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Valéria suspira e admite o golpe menor: "Sim, falsifiquei a comissão da tela! Mas os garçons me viram entrando no camarim às 22h27 — muito antes do Prof. Caio escorregar para a Sala VIP com aquele frasco de vidro!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Valéria balança a cabeça: "Já admiti meus pecados financeiros, mas não sou assassina!"',
                    wrongMood: 'nervous'
                },
                {
                    id: 'gabriel',
                    name: 'Gabriel Soares',
                    age: 45,
                    role: 'Chefe da segurança externa',
                    profile: 'Disciplinado; monitorava o portão principal durante todo o leilão.',
                    statement:
                        'Fiquei na guarita externa das 22h15 às 22h55 checando placas de carros suspeitos. A cancela registra todos os meus comandos.',
                    alibi: 'Estava na guarita externa acompanhado do manobrista entre 22h15 e 22h55.',
                    portrait: 'man_uniform',
                    questions: [
                        { id: 'q1', q: 'Alguém entrou pelos fundos após as 22h30?', a: 'Não, apenas uma van preta com emblema de tambor estacionou longe esperando o curador.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Gabriel aponta o registro: "Cada placa liberada exigiu minha digital na guarita às 22h34, 22h39 e 22h44."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Gabriel permanece firme: "Estive o tempo todo no portão da rua."',
                    wrongMood: 'calm'
                },
                {
                    id: 'leticia',
                    name: 'Letícia Prado',
                    age: 26,
                    role: 'Assistente administrativa',
                    profile: 'Observadora; organizava as taças do serviço VIP.',
                    statement:
                        'Servi a garrafa lacrada na Sala VIP às 22h28 e voltei à copa. Só voltei lá depois que gritaram às 22h42.',
                    alibi: 'Estava na copa do salão principal.',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'Você viu alguém próximo ao balde de gelo após às 22h30?', a: 'Se houver indício sobre o desvio da conta que o Eduardo auditava, talvez eu ligue os nomes.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e6',
                            response:
                                'Letícia tapa a boca espantada: "SAHUR-333?! Essa sigla estava escrita num frasquinho que caiu do bolso do Prof. Caio às 22h36 quando ele me empurrou perto da porta da Sala VIP! Pensei que fosse colírio!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Letícia murmura: "Desculpe, detetive, não sei ligar isso ao caso."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Toxicológico VIP',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame de sangue de Eduardo Motta e resíduo da taça.',
                    doc: 'CAUSA DA MORTE: Alcaloide vegetal concentrado (ação em 2 minutos) misturado ao champanhe.\nHORA DO COLAPSO: 22h40.'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Catálogo Anotado pelo Auditor',
                    type: 'message',
                    initial: false,
                    foundAtHotspot: 'viproom',
                    desc: 'Encontrado junto ao corpo com anotações de Eduardo.',
                    doc: 'ANOTAÇÃO: "Lotes fantasma usados para lavar dinheiro hoje:\n* Lote 7 (Escultura) — Superfaturado\n* Lote 3 (Relógio) — Superfaturado\n* Lote 9 (Teca) — Superfaturado\nCOMBINAÇÃO DA MINHA MALETA: os 3 dígitos dos lotes marcados (*)."'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Log Biométrico da Guarita Externa',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'parking',
                    desc: 'Registro com leitura digital da cancela do estacionamento.',
                    doc: 'OPERADOR GABRIEL SOARES:\n22h34 -> Digital validada\n22h39 -> Digital validada\n22h44 -> Digital validada\nImpossível acesso simultâneo à Sala VIP.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Contrato Adulterado de Valéria',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'stage',
                    desc: 'Documento rasurado no púlpito + horário de saída confirmado.',
                    doc: 'FRAUDE MENOR: Valéria elevou comissão de 10% para 35%.\nTESTEMUNHO DOS GARÇONS: Valéria entrou no camarim do 2º andar às 22h27 (sem veneno na taça naquele momento).'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Metadados & Reflexo na Foto Oficial',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'viproom',
                    desc: 'Foto tirada na antecâmara da Sala VIP pelo fotógrafo social.',
                    doc: 'EXIF: 22h38m14s.\nAMPLIAÇÃO NO ESPELHO LATERAL: Mostra claramente o Prof. Caio Bernardes dentro da Sala VIP despejando gotas de um frasco na taça de Eduardo!'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Extrato Offshore CONTA SAHUR-333',
                    type: 'cipher',
                    initial: false,
                    foundAtHotspot: 'briefcase',
                    desc: 'Recuperado da maleta após girar os discos para 7-3-9.',
                    doc: 'CONTA OFFSHORE: SAHUR-333\nADMINISTRADOR: Prof. Caio Bernardes\nVALOR LAVADO NO LEILÃO: R$ 14,5 milhões destinados a "Operação Madrugada — Tribunal".'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Relato do Frasco de Letícia (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Confirmado ao mostrar o extrato SAHUR-333 para Letícia.',
                    doc: 'DEPOIMENTO: Letícia confirmou que Caio derrubou um frasquinho rotulado "SAHUR-333" às 22h36 ao sair apressado da porta da Sala VIP.'
                }
            ],
            timeline: [
                { time: '22h20', text: 'Valéria vai à Sala VIP pegar o contrato adulterado (sai às 22h25).', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: false },
                { time: '22h28', text: 'Letícia serve a garrafa limpa na Sala VIP.', source: 'Depoimento', crimeWindow: false },
                { time: '22h34', text: 'Gabriel valida digital na cancela externa (repetido às 22h39 e 22h44).', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: true },
                { time: '22h36', text: 'Caio esbarra em Letícia na saída da antecâmara com um frasco SAHUR-333.', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: true },
                { time: '22h38', text: 'Reflexo na foto oficial flagra Prof. Caio pingando veneno na taça dentro da Sala VIP.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '22h40', text: 'Eduardo bebe o champanhe e sofre parada fulminante.', source: 'Evidência E1', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:caio', to: 'evidence:e5', relation: 'contradiz', insight: 'A foto das 22h38 coloca Caio exatamente dentro da Sala VIP!' },
                { from: 'suspect:caio', to: 'evidence:e6', relation: 'motivo', insight: 'Caio administrava a conta SAHUR-333 ameaçada pela auditoria de Eduardo.' },
                { from: 'suspect:gabriel', to: 'evidence:e3', relation: 'confirma', insight: 'Biometria na cancela às 22h34/22h39/22h44 inocenta Gabriel.' }
            ],
            hints: [
                'Nível 1: Leia os lotes marcados com (*) no catálogo E2 para abrir a maleta executiva (739).',
                'Nível 2: Amplie a evidência E5 — o reflexo da foto de 22h38 desmente completamente quem disse não ter entrado na Sala VIP.',
                'Nível 3: Prof. Caio Bernardes envenenou a taça de champanhe com alcaloide (E1) para proteger a conta SAHUR-333 (E6), flagrado por E5.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'alkaloid_champagne', label: 'Envenenamento por alcaloide vegetal concentrado pingado na taça de champanhe' },
                    { id: 'poisoned_pen', label: 'Contato cutâneo com tinta tóxica aplicada na caneta do contrato' },
                    { id: 'strangulation', label: 'Estrangulamento silencioso após a saída do fotógrafo' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Reflexo na Foto Oficial das 22h38 dentro da Sala VIP' },
                    { id: 'e4', label: 'E4 — Contrato Adulterado de Valéria' },
                    { id: 'e3', label: 'E3 — Log Biométrico da Guarita Externa' }
                ]
            },
            solution: {
                culpritId: 'caio',
                methodId: 'alkaloid_champagne',
                alibiBreakerId: 'e5',
                syndicateClue: 'R$ 14,5 milhões foram lavados via Mansão Cristal na conta SAHUR-333 para financiar a "Operação Madrugada".',
                explanation:
                    'Eduardo Motta descobriu a lavagem de R$ 14,5 milhões através de três lotes fantasma (7-3-9) para a conta SAHUR-333, gerida pelo Prof. Caio Bernardes (E2, E6). Valéria havia saído às 22h25 após adulterar apenas sua comissão (E4), e Gabriel estava na guarita externa (E3). O reflexo no espelho da foto tirada às 22h38 (E5) desmente o álibi de Caio e o flagra contaminando a taça.',
                wrongEndings: {
                    valeria: {
                        title: 'Fraude Descoberta, Tesoureiro em Fuga',
                        text: 'Valéria chorou e confessou a fraude do quadro, mas os garçons confirmaram sua saída às 22h25. Caio aproveitou o tumulto, transferiu os R$ 14,5 milhões e desapareceu na van preta do Sindicato.'
                    },
                    gabriel: {
                        title: 'Digital na Guarita Anula Mandado',
                        text: 'Os registros biométricos contínuos na cancela (E3) impediram qualquer acusação contra Gabriel. A Mansão Cristal fechou as portas antes que os extratos fossem bloqueados.'
                    },
                    leticia: {
                        title: 'Erro Contra a Testemunha da Porta',
                        text: 'Prender Letícia destruiu o depoimento sobre o frasco SAHUR-333. O curador queimou os livros contábeis naquela mesma noite.'
                    },
                    _partial: {
                        title: 'Acusação Incompleta',
                        text: 'Você apontou o Prof. Caio, mas precisa vincular o alcaloide no champanhe (E1) e a prova fotográfica E5.'
                    },
                    _default: {
                        title: 'Inquérito Contestado no Leilão',
                        text: 'Revise a janela de 22h32 a 22h45 e abra a maleta executiva.'
                    }
                }
            }
        },

        /* ===================== CASO 5 ===================== */
        {
            id: 'caso-05',
            order: 5,
            act: 'Ato III — O Cerco',
            isTutorial: false,
            unlockRequires: 'caso-04',
            code: 'DOSSIÊ #05-033',
            title: 'A Última Transmissão',
            difficulty: 'Dificuldade: Muito Difícil',
            victim: 'Mário Rezende (47 anos, locutor do programa "Madrugada Sem Máscara")',
            location: 'Estúdio 02 — Rádio Metropolitana AM/FM',
            timeOfDeath: '03h33 (microfone aberto captou três batidas e corte brusco de ar)',
            crimeWindowLabel: 'JANELA DA MORTE: 03h26 – 03h35 (Três batidas no ar às 03h33)',
            summary:
                'O radialista Mário Rezende anunciou ao vivo que revelaria às 03h35 o nome do verdadeiro chefe por trás das mortes do porto e do leilão. Exatamente às 03h33, ouvintes escutaram três batidas secas de madeira no estúdio, seguidas pelo silêncio. A porta acústica do Estúdio 02 estava travada e a sala foi inundada por gás inodoro através da válvula de ventilação do corredor.',
            hotspots: [
                {
                    id: 'studio',
                    x: 160, y: 110,
                    label: 'Estúdio 02 & Console Digital',
                    detail: 'O gravador de backup na mesa pede senha de 4 dígitos para liberar a gravação bruta antes do corte. Dica no laudo E1: o horário exato do apagão no ar (0333).',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-05',
                        type: 'keypad',
                        title: 'Console de Backup da Cabine',
                        prompt: 'Digite os 4 dígitos (HHMM) da hora exata das três batidas citadas no Laudo E1.',
                        clueRef: 'Veja E1: horário exato em que o sinal caiu com as três batidas (03h33 -> 0333).',
                        answer: '0333',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'valves',
                    x: 345, y: 80,
                    label: 'Sala de Válvulas & Duto',
                    detail: 'Cilindro de gás acoplado ao duto do Estúdio 02. O painel digital gravou o código mestre utilizado às 03h28 (E5) e um bilhete de desvio publicitário de Igor (E4).',
                    unlocksEvidences: ['e5', 'e4']
                },
                {
                    id: 'lounge',
                    x: 110, y: 205,
                    label: 'Cabine de Produção',
                    detail: 'Log de transmissão remota comprovando a videochamada contínua de Vanessa (E3).',
                    unlocksEvidences: ['e3']
                },
                {
                    id: 'archive',
                    x: 345, y: 205,
                    label: 'Arquivo de Fitas',
                    detail: 'Cópia física da pauta anotada de Mário com o histórico do ex-delegado Sérgio (E2).',
                    unlocksEvidences: ['e2']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#141a21"/>
                    <rect x="24" y="24" width="392" height="202" fill="rgba(45,70,88,0.2)" stroke="#85b5cc" stroke-width="2.5"/>
                    <rect x="60" y="54" width="195" height="90" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="158" y="96" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">ESTÚDIO 02 (AR)</text>
                    <text x="158" y="110" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Console Trancado)</text>
                    <rect x="285" y="45" width="115" height="75" fill="#23323b" stroke="#c99e32" stroke-width="1.6"/>
                    <text x="342" y="80" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">SALA VÁLVULAS</text>
                    <rect x="52" y="168" width="145" height="48" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="124" y="196" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">PRODUÇÃO</text>
                    <rect x="278" y="168" width="122" height="48" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="339" y="196" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">ARQUIVO FITAS</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'sergio',
                    name: 'Sérgio Barreto',
                    age: 56,
                    role: 'Consultor de segurança e ex-delegado',
                    profile: 'Frio, intimidador; foi afastado da polícia em 2021 e contratado como consultor da rádio.',
                    statement:
                        'Fiquei na minha sala no térreo lendo relatórios das 03h00 às 03h50. Eu sequer possuo a chave da Sala de Válvulas do 3º andar!',
                    alibi: 'Alega não ter subido ao 3º andar nem possuir acesso à Sala de Válvulas.',
                    portrait: 'man_hat',
                    questions: [
                        { id: 'q1', q: 'Por que Mário citou seu nome na pauta daquela madrugada?', a: 'Despeito de radialista! Ele queria ligar minha consultoria a uma lenda urbana absurda de madrugada.', mood: 'furious' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Sérgio estreita os olhos e trava os dentes: "O painel da válvula aceitou o CÓDIGO MESTRE DE SEGURANÇA #SB-01 às 03h28?! Isso... alguém clonou minha credencial de consultor! Você não vai chegar ao chefe do Sindicato!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'furious'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Sérgio recua um passo ao ouvir o áudio bruto: "Esse microfone captou minha voz no corredor?! Maldito técnico que deixou o ganho aberto... O homem que você caça é maior que toda a polícia!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Sérgio encara sem piscar: "Já vi interrogatórios melhores, recruta."',
                    wrongMood: 'calm'
                },
                {
                    id: 'igor',
                    name: 'Igor Peixoto',
                    age: 31,
                    role: 'Técnico de áudio da madrugada',
                    profile: 'Endividado; inseria vinhetas clandestinas na grade da madrugada por fora.',
                    statement:
                        'Às 03h25 fui ao banheiro do térreo e depois saí pela porta dos fundos para receber dinheiro de um anunciante pirata na rua até 03h40. Só voltei quando o sinal caiu!',
                    alibi: 'Estava fora da cabine negociando anúncios piratas na porta lateral.',
                    portrait: 'man_beard',
                    questions: [
                        { id: 'q1', q: 'Você alterou algum canal antes de sair?', a: 'Só deixei a trilha de intervalo armada, mas o gás não foi comigo!', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Igor sua frio e entrega tudo: "Está bem! Eu estava desviando dinheiro de comerciais piratas na madrugada! Quando voltei pela escada de incêndio às 03h34, vi o ex-delegado Sérgio fechando a porta da Sala de Válvulas com luvas pretas e uma baqueta de madeira na mão!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Igor levanta as mãos: "Eu só mexo com áudio pirata, nada de homicídio!"',
                    wrongMood: 'nervous'
                },
                {
                    id: 'vanessa',
                    name: 'Vanessa Lins',
                    age: 35,
                    role: 'Produtora executiva',
                    profile: 'Trabalhava em home office preparando a pauta do dia seguinte.',
                    statement:
                        'Estava em casa fazendo reunião por vídeo gravada com a equipe da manhã das 03h10 às 03h55.',
                    alibi: 'Videochamada gravada em tempo real a 12 km da emissora.',
                    portrait: 'woman_doctor',
                    questions: [
                        { id: 'q1', q: 'Mário lhe enviou a pauta completa antes do programa?', a: 'Mandou só o título: "As Três Batidas das 03h33". Disse que ia citar um ex-delegado.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Vanessa mostra o registro do servidor: "Veja o IP residencial e o vídeo contínuo em alta definição sem cortes de 03h10 às 03h55."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Vanessa suspira: "Eu nem estava no prédio durante a madrugada."',
                    wrongMood: 'calm'
                },
                {
                    id: 'tania',
                    name: 'Tânia Moura',
                    age: 23,
                    role: 'Estagiária de jornalismo',
                    profile: 'Curiosa e dedicada; guardou cópia do áudio antes do apagão.',
                    statement:
                        'Eu estava na recepção do térreo revisando mensagens dos ouvintes quando tudo saiu do ar às 03h33.',
                    alibi: 'Confirmada pelas câmeras da recepção.',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'Você reparou em alguém entrando ou saindo pela escada entre 03h20 e 03h40?', a: 'Preciso ouvir ou ler a transcrição do áudio bruto primeiro para lembrar quem subiu!', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e6',
                            response:
                                'Tânia arregala os olhos ao ler a transcrição: "Essa voz no fundo dizendo \'Sem testemunhas, ordem do Sahur\' é exatamente do Sérgio Barreto! E lembrei agora: às 03h24 ele pegou o elevador de serviço levando um cilindro metálico dentro de uma capa de violão!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Tânia balança a cabeça: "Não consigo ligar isso ao áudio do programa."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Asfixiológico & Registro de Corte',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame médico no Estúdio 02 após ventilação de emergência.',
                    doc: 'CAUSA DA MORTE: Asfixia por nitrogênio/monóxido inodoro injetado pelo duto de ar.\nHORÁRIO DO CORTE NO AR: 03h33 (três batidas graves captadas antes da queda).'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Pauta Secreta de Mário (Arquivo)',
                    type: 'message',
                    initial: false,
                    foundAtHotspot: 'archive',
                    desc: 'Anotações manuscritas do locutor encontradas no Arquivo de Fitas.',
                    doc: 'PAUTA: "O braço armado do Sindicato T.T.T.S. é o ex-delegado Sérgio Barreto — ele coordena a queima de arquivos entre o Porto e o Leilão."'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Log da Videochamada (Servidor)',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'lounge',
                    desc: 'Registro criptografado do servidor de reuniões da emissora.',
                    doc: 'PARTICIPANTE: Vanessa Lins (IP Residencial)\nDURAÇÃO CONTÍNUA: 03h10 às 03h55 (com áudio e vídeo ininterruptos).'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Planilha de Comerciais Piratas',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'valves',
                    desc: 'Anotações encontradas na escada lateral com câmera externa anexa.',
                    doc: 'DELITO MENOR: Igor recebeu R$ 800 por fora na porta lateral às 03h29.\nCÂMERA PORTA LATERAL: Igor retornava às 03h34 quando cruzou com Sérgio.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Log da Sala de Válvulas (#SB-01)',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'valves',
                    desc: 'Painel eletrônico da porta e controle de válvulas do 3º andar.',
                    doc: '03h27 -> Porta aberta com CÓDIGO MESTRE DE SEGURANÇA #SB-01 (exclusivo de Sérgio Barreto).\n03h28 -> Válvula do Estúdio 02 aberta por 5 minutos.'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Transcrição do Áudio Bruto (Desbloqueado)',
                    type: 'audio',
                    initial: false,
                    foundAtHotspot: 'studio',
                    desc: 'Extraído do console com senha 0333.',
                    doc: 'ÁUDIO [03h32m50s]: Batida na janela acústica -> "Tung... Tung... Tung..."\nVOZ GRAVE PELO DUTO: "Recado dado. Sem testemunhas, ordem de Domingos Karvalho — o Sahur."'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Depoimento da Capa de Violão (Desbloqueado)',
                    type: 'photo',
                    secret: true,
                    desc: 'Obtido ao confrontar Tânia com a transcrição E6.',
                    doc: 'TÂNIA MOURA: Confirmou que Sérgio subiu às 03h24 no elevador de serviço carregando um cilindro dentro de uma capa de violão.'
                }
            ],
            timeline: [
                { time: '03h10', text: 'Vanessa inicia videochamada contínua de casa até 03h55.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: false },
                { time: '03h24', text: 'Sérgio sobe no elevador de serviço levando capa de violão (cilindro de gás).', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: false },
                { time: '03h27', text: 'Sala de Válvulas é aberta com o código mestre #SB-01 de Sérgio.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '03h29', text: 'Igor recebe pagamento clandestino na porta lateral (longe do 3º andar).', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '03h33', text: 'Três batidas ressoam no ar; Mário morre por asfixia no Estúdio 02.', source: 'Evidência E1 & E6', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:sergio', to: 'evidence:e5', relation: 'contradiz', insight: 'O código mestre #SB-01 na Sala de Válvulas às 03h27 desmente Sérgio!' },
                { from: 'suspect:sergio', to: 'evidence:e2', relation: 'motivo', insight: 'Mário ia revelar o papel de Sérgio no Sindicato ao vivo às 03h35.' },
                { from: 'suspect:sergio', to: 'evidence:e6', relation: 'liga a', insight: 'A voz gravada cita diretamente o chefe "Domingos Karvalho — o Sahur".' }
            ],
            hints: [
                'Nível 1: Use o horário exato do crime (0333) para destravar o console no Estúdio 02 e obter E6.',
                'Nível 2: Confronte Igor com E4 e Tânia com E6. Veja o código #SB-01 em E5.',
                'Nível 3: O ex-delegado Sérgio Barreto usou seu código mestre #SB-01 às 03h27 na Sala de Válvulas (E5) para abrir o gás tóxico.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'vent_gas_valve', label: 'Liberação de gás asfixiante pelo duto através da Sala de Válvulas' },
                    { id: 'electric_mic', label: 'Choque elétrico sabotado diretamente na mesa de som' },
                    { id: 'coffee_poison', label: 'Veneno diluído no café da madrugada antes do programa' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Log da Sala de Válvulas com código exclusivo #SB-01 às 03h27' },
                    { id: 'e4', label: 'E4 — Planilha de Comerciais Piratas de Igor' },
                    { id: 'e3', label: 'E3 — Log da Videochamada de Vanessa' }
                ]
            },
            solution: {
                culpritId: 'sergio',
                methodId: 'vent_gas_valve',
                alibiBreakerId: 'e5',
                syndicateClue: 'O áudio revelou o nome verdadeiro do chefe nas sombras: Domingos Karvalho — apontado como o mandante da rede T.T.T.S.',
                explanation:
                    'Mário Rezende estava prestes a denunciar Sérgio Barreto e revelar o nome do líder supremo do Sindicato ao vivo às 03h35 (E2, E6). Vanessa estava em videochamada contínua (E3) e Igor negociava comerciais piratas no térreo (E4). Às 03h24 Sérgio subiu com o cilindro oculto (E7), abriu a Sala de Válvulas com o código exclusivo #SB-01 às 03h27 (E5) e injetou o gás asfixiante às 03h33.',
                wrongEndings: {
                    igor: {
                        title: 'Técnico Pirata Preso, Capanga Solto',
                        text: 'Igor assumiu a venda clandestina de anúncios, mas a câmera da porta lateral provou que ele estava fora do prédio às 03h29. Sérgio desapareceu antes que o mandado fosse corrigido.'
                    },
                    vanessa: {
                        title: 'Servidor Derruba Acusação em 5 Minutos',
                        text: 'A transmissão contínua em alta definição da reunião online (E3) inocentou Vanessa imediatamente. A fita bruta sumiu na manhã seguinte.'
                    },
                    tania: {
                        title: 'Prisão Injusta da Estagiária',
                        text: 'Você intimidou a estagiária que preservou a gravação de backup. Sérgio aproveitou o erro para avisar Domingos Karvalho.'
                    },
                    _partial: {
                        title: 'Mandado Incompleto',
                        text: 'Sérgio é o culpado, mas você precisa apontar o gás na Sala de Válvulas e a quebra de álibi E5.'
                    },
                    _default: {
                        title: 'Inquérito Contestado na Emissora',
                        text: 'Revise o áudio bruto (0333) e os logs da Sala de Válvulas.'
                    }
                }
            }
        },

        /* ===================== CASO 6: FINAL ===================== */
        {
            id: 'caso-06',
            order: 6,
            act: 'Ato Final — O Tribunal',
            isTutorial: false,
            unlockRequires: 'caso-05',
            code: 'DOSSIÊ #06-FINAL',
            title: 'Operação Madrugada: O Tribunal das 03h33',
            difficulty: 'Dificuldade: Mestre',
            victim: 'Juiz-Corregedor Alberto Nogueira (60 anos, presidente da força-tarefa especial)',
            location: 'Sala Cofre — Anexo do Palácio da Justiça',
            timeOfDeath: '03h33 (três marcas profundas de baqueta de teca sobre a escrivaninha)',
            crimeWindowLabel: 'JANELA DA MORTE: 03h25 – 03h35 (Execução ritual às 03h33)',
            summary:
                'Todos os fios convergem aqui. Horas antes de assinar os mandados contra a cúpula da rede T.T.T.S., o Juiz Alberto foi morto dentro da Sala Cofre por um dardo neurotóxico disparado pela grelha do duto de ventilação às 03h33 — exatamente quando três batidas de madeira teca ecoaram no corredor. O magnata Domingos Karvalho afirma estar discursando ao vivo no Auditório na mesma hora.',
            hotspots: [
                {
                    id: 'vault',
                    x: 155, y: 95,
                    label: 'Sala Cofre & Celular do Juiz',
                    detail: 'O celular criptografado do Juiz pede um PIN de 4 dígitos. Dica do bilhete no paletó: "Hora da madrugada invertida: 3330 (ou espelho de 0333)".',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-06a',
                        type: 'phone_pin',
                        title: 'Celular Criptografado do Juiz',
                        prompt: 'Digite o PIN de 4 dígitos descrito no bilhete do Juiz (03h33 invertido -> 3330).',
                        clueRef: 'E1 menciona a sigla 0333 e o bilhete pede os dígitos invertidos: 3330.',
                        answer: '3330',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'duct',
                    x: 295, y: 78,
                    label: 'Duto de Ventilação (Trava Cifrada)',
                    detail: 'Compartimento técnico acima da Sala Cofre selado com palavra cifrada "UBNCPS" (deslocamento +1 de César). Decifre para trás (-1)!',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-06b',
                        type: 'cipher',
                        title: 'Trava do Duto Técnico',
                        prompt: 'Decifre "UBNCPS" deslocando cada letra 1 posição para trás no alfabeto (B->A, C->B...).',
                        clueRef: 'U→T, B→A, N→M, C→B, P→O, S→R.',
                        cipherText: 'UBNCPS',
                        cipherHint: 'Deslocamento -1 (César)',
                        answer: 'TAMBOR',
                        unlocksEvidences: ['e7']
                    }
                },
                {
                    id: 'auditorium',
                    x: 345, y: 185,
                    label: 'Auditório & Transmissão',
                    detail: 'Você recolhe a Análise Forense do Vídeo da Palestra de Domingos Karvalho (E5) e o registro policial da Escolta (E3).',
                    unlocksEvidences: ['e5', 'e3']
                },
                {
                    id: 'clerk',
                    x: 90, y: 188,
                    label: 'Secretaria & Rede Wi-Fi',
                    detail: 'Fotos de despacho menor tiradas pela promotora Lívia (E2) e log do técnico Jonas apagando multas de trânsito no servidor local (E4).',
                    unlocksEvidences: ['e2', 'e4']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#12171d"/>
                    <rect x="20" y="20" width="400" height="210" fill="rgba(45,70,88,0.22)" stroke="#c99e32" stroke-width="2.5"/>
                    <rect x="55" y="46" width="175" height="90" fill="rgba(158,27,27,0.3)" stroke="#d46363" stroke-width="2"/>
                    <text x="142" y="88" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">SALA COFRE</text>
                    <text x="142" y="102" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Juiz + Celular)</text>
                    <rect x="245" y="46" width="145" height="72" fill="#23323b" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="318" y="82" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">DUTO TÉCNICO</text>
                    <text x="318" y="96" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(Trava Cifrada)</text>
                    <rect x="44" y="156" width="145" height="54" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="116" y="186" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">SECRETARIA / TI</text>
                    <rect x="245" y="142" width="155" height="70" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="322" y="180" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">AUDITÓRIO (VÍDEO)</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'sahur',
                    name: 'Domingos Karvalho',
                    age: 53,
                    role: 'Magnata, mecenas e alvo principal do inquérito T.T.T.S.',
                    profile: 'Cultura refinada, obcecado por pontualidade das 03h33 e pelo som ritual de baqueta em teca.',
                    statement:
                        'É ultrajante me trazer aqui! Às 03h33 eu estava discursando ao vivo no telão do Auditório do Anexo sobre meu patrocínio à cultura! Centenas de câmeras e o feed da casa viram minha palestra.',
                    alibi: 'Afirma estar discursando ao vivo no Auditório às 03h33 conforme o vídeo da transmissão.',
                    portrait: 'mastermind_sahur',
                    questions: [
                        { id: 'q1', q: 'Por que suas empresas apareceram na galeria, no trem, no porto e no leilão?', a: 'Investimentos diversificados em arte, logística e medicina. Se subordinados cometeram excessos, não cabe a mim responder.', mood: 'calm' },
                        { id: 'q2', q: 'O que significa a marca "T.T.T.S." e as três batidas às 03h33?', a: 'Uma simples tradição folclórica do amanhecer que me rendeu o apelido na imprensa... nada criminoso.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Os olhos dourados de Karvalho se arregalam pela primeira vez e o suor frio escorre pela têmpora: "O relógio analógico atrás do púlpito na transmissão marcava 01h15?! Aquele estúpido da transmissão esqueceu de cortar a parede do fundo... O vídeo era pré-gravado às 01h15! Mas... isso não prova que usei a zarabatana do duto!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e7',
                            response:
                                'Karvalho bate o punho na mesa furioso, derrubando a máscara elegante: "Minha zarabatana de teca e a baqueta gravada T.T.T.S.?! O Juiz ia assinar minha extradição hoje de manhã — eu mesmo dei as três batidas do Sahur antes de encerrar o expediente dele!"',
                            unlocksEvidenceId: 'e8',
                            marksContradiction: true,
                            mood: 'furious'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Domingos ri com frieza sombria: "Então você descobriu quem está por trás de Tung Tung Tung Sahur — da relojoaria até aqui. Pena que um vídeo ao vivo ainda me mantenha no palco..."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Karvalho sorri calmamente: "Você precisará de mais que coincidências para tocar no meu império, detetive."',
                    wrongMood: 'calm'
                },
                {
                    id: 'livia',
                    name: 'Promotora Lívia Drummond',
                    age: 40,
                    role: 'Promotora adjunta da força-tarefa',
                    profile: 'Ambiciosa; fotografou despachos sigilosos para vazar à imprensa e ganhar fama.',
                    statement:
                        'Passei na Sala Cofre às 02h50 apenas para ler os nomes do processo antes da coletiva, depois desci ao refeitório do térreo com dois jornalistas até 03h50.',
                    alibi: 'Estava no refeitório com dois jornalistas desde 03h00.',
                    portrait: 'woman_doctor',
                    questions: [
                        { id: 'q1', q: 'Por que fotografou documentos internos sem autorização?', a: 'Eu queria o crédito da manchete de amanhã, não a morte do Juiz!', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response:
                                'Lívia confessa cabisbaixa: "Sim, vazei a prévia da lista para a imprensa às 02h55! Mas os jornalistas não tiraram os olhos de mim no refeitório às 03h33 — e às 03h29 vi o magnata Domingos Karvalho saindo do elevador técnico perto do duto!"',
                            unlocksEvidenceId: 'e9',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Lívia respira fundo: "Vazar pauta não é assassinato, detetive."',
                    wrongMood: 'furious'
                },
                {
                    id: 'jonas',
                    name: 'Jonas Teixeira',
                    age: 27,
                    role: 'Técnico de TI do Anexo',
                    profile: 'Inseguro; usou acesso root para apagar multas de trânsito pessoais na madrugada.',
                    statement:
                        'Eu estava na sala de servidores no subsolo desde as 03h00 — nunca mexi na transmissão do Auditório.',
                    alibi: 'Ficou logado na sala de servidores (mas manipulava registros de trânsito).',
                    portrait: 'man_glasses',
                    questions: [
                        { id: 'q1', q: 'Você sabia que o vídeo do Auditório estava rodando em loop gravado?', a: 'Que?! Se alguém agendou um replay de 01h15 no servidor, usou o painel físico do Auditório!', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Jonas gela e admite o delito menor: "Por favor! Eu só apaguei 5 multas minhas no sistema do Detran às 03h31! Mas os logs mostram que às 03h20 foi o próprio Domingos Karvalho quem acionou o replay do vídeo no servidor do Auditório!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Jonas treme: "Eu só mexi nas minhas multas, eu juro!"',
                    wrongMood: 'nervous'
                },
                {
                    id: 'heitor',
                    name: 'Cmdt. Heitor Braga',
                    age: 50,
                    role: 'Comandante da escolta do Palácio',
                    profile: 'Militar rigoroso, liderava a central de monitoramento externo.',
                    statement:
                        'Fiquei na central de rádios com quatro agentes o tempo todo entre 03h00 e 04h00.',
                    alibi: 'Acompanhado por quatro agentes na central de rádios.',
                    portrait: 'man_uniform',
                    questions: [
                        { id: 'q1', q: 'Como o dardo entrou na Sala Cofre trancada?', a: 'Apenas pelo duto técnico acima do teto, onde só alguém ágil e com chave do painel entraria.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Heitor mostra o registro assinado por quatro oficiais: "Todos os rádios têm gravação contínua com minha voz comandando o perímetro às 03h33."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Heitor bate continência seca: "Meu posto tem quatro testemunhas fardadas."',
                    wrongMood: 'calm'
                },
                {
                    id: 'marta',
                    name: 'Marta Alencar',
                    age: 55,
                    role: 'Escrivã do gabinete',
                    profile: 'Fiel ao Juiz há 20 anos; organizava os autos do Sindicato.',
                    statement:
                        'Trabalhei no andar térreo organizando os anexos lacrados até o alarme soar às 03h36.',
                    alibi: 'Confirmada pelas catracas do térreo.',
                    portrait: 'woman_elder',
                    questions: [
                        { id: 'q1', q: 'O Juiz comentou sobre a senha do celular antes de entrar na Sala Cofre?', a: 'Sim, disse rindo que inverteu a assinatura horária deles — 0333 virou 3330.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e6',
                            response:
                                'Marta segura as lágrimas: "Esse dossiê no celular reúne todos os crimes — da relojoaria de Vicente ao trem, ao porto, ao leilão e à rádio. Tudo convergia para Domingos Karvalho!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'nervous'
                        }
                    ],
                    wrongConfront: 'Marta ajusta os óculos: "Eu servi o Juiz por vinte anos, detetive."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo do Dardo Neurotóxico',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame da Sala Cofre lacrada por dentro.',
                    doc: 'CAUSA DA MORTE: Dardo revestido com toxina paralisante disparado pela grelha do duto superior.\nHORA: 03h33.\nMARCAS NA MESA: Três entalhes rituais de baqueta.\nBILHETE DO JUIZ: "PIN do celular = 0333 invertido (3330)."'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Fotos Vazadas de Lívia (02h55)',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'clerk',
                    desc: 'Registros enviados por Lívia para a imprensa antes do crime.',
                    doc: 'DELITO MENOR: Lívia fotografou rascunhos às 02h55.\nÁLIBI: Dois jornalistas no refeitório atestam presença dela de 03h00 às 03h50.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Registro da Central de Rádios',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'auditorium',
                    desc: 'Comunicações gravadas em áudio contínuo da escolta.',
                    doc: 'VOZ DO CMDT. HEITOR: Transmissão contínua às 03h28, 03h33 e 03h37 diante de 4 oficiais.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Log do Técnico Jonas (Servidor)',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'clerk',
                    desc: 'Auditoria de acessos na rede do Anexo.',
                    doc: '03h20 -> Domingos Karvalho agendou replay no painel físico do Auditório.\n03h31 -> Jonas apagou 5 multas pessoais da sala de servidores no subsolo.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Análise Forense do Vídeo do Auditório',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'auditorium',
                    desc: 'Perícia quadro a quadro da "transmissão ao vivo" de Karvalho às 03h33.',
                    doc: 'PROVA IRREFUTÁVEL DE ÁLIBI FORJADO:\nApesar do relógio digital da live marcar 03h33, o relógio analógico de parede atrás do púlpito marca exatamente 01h15!\nCONCLUSÃO: O vídeo era uma gravação feita duas horas antes para forjar presença no Auditório!'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Dossiê Mestre do Sindicato (Celular)',
                    type: 'cipher',
                    initial: false,
                    foundAtHotspot: 'vault',
                    desc: 'Desbloqueado no celular do Juiz com PIN 3330.',
                    doc: 'ORGANOGRAMA T.T.T.S. (TUNG TUNG TUNG SAHUR):\n- Líder Supremo: Domingos Karvalho\n- Peças/Receptação: Relojoaria (Caso 0) & Galeria (Caso 1)\n- Lavagem Clínica: Holding T.T.T.S. (Caso 2)\n- Logística: Sahur Importações (Caso 3) & Conta SAHUR-333 (Caso 4)\n- Braço Armado: Sérgio Barreto (Caso 5)'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Zarabatana & Baqueta "T.T.T.S."',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'duct',
                    desc: 'Encontradas no duto técnico após decifrar UBNCPS → TAMBOR.',
                    doc: 'ARMAS DO CRIME: Tubo de sopro em madeira teca escura + baqueta cerimonial gravada com "T.T.T.S." e digitais parciais de Domingos Karvalho.'
                },
                {
                    id: 'e8',
                    code: 'E8',
                    title: 'Confissão Final de Karvalho (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtida ao confrontar Karvalho com a zarabatana/baqueta (E7).',
                    doc: 'CONFISSÃO PARCIAL: Domingos admitiu ser a mente por trás de Tung Tung Tung Sahur, ter dado as três batidas e disparado o dardo às 03h33 para impedir a extradição.'
                },
                {
                    id: 'e9',
                    code: 'E9',
                    title: 'Testemunho da Escada Técnica (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtido ao confrontar Lívia com E2.',
                    doc: 'LÍVIA: Viu Domingos Karvalho saindo do elevador de serviço perto do duto técnico às 03h29.'
                }
            ],
            timeline: [
                { time: '01h15', text: 'Domingos Karvalho grava sua palestra no Auditório diante do relógio de parede.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: false },
                { time: '02h55', text: 'Promotora Lívia fotografa prévia da lista e desce ao refeitório com jornalistas.', source: 'Evidência E2', requiresEvidence: 'e2', crimeWindow: false },
                { time: '03h20', text: 'Karvalho programa o replay da palestra de 01h15 para simular transmissão ao vivo.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: false },
                { time: '03h29', text: 'Lívia observa Karvalho junto ao elevador próximo ao duto técnico.', source: 'Evidência E9 (Oculta)', requiresEvidence: 'e9', crimeWindow: true },
                { time: '03h31', text: 'Jonas apaga multas pessoais na sala de servidores do subsolo.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '03h33', text: 'Três batidas no duto; Juiz é atingido por dardo neurotóxico enquanto o telão exibe o vídeo gravado às 01h15.', source: 'Evidências E1, E5 & E7', requiresEvidence: 'e5', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:sahur', to: 'evidence:e5', relation: 'contradiz', insight: 'O relógio de parede marcando 01h15 prova que a palestra ao vivo às 03h33 era gravação forjada!' },
                { from: 'suspect:sahur', to: 'evidence:e7', relation: 'liga a', insight: 'A zarabatana de teca e baqueta T.T.T.S. conectam Karvalho diretamente ao duto.' },
                { from: 'suspect:sahur', to: 'evidence:e6', relation: 'motivo', insight: 'O Dossiê Mestre ligava todos os 6 casos anteriores a Domingos Karvalho.' }
            ],
            hints: [
                'Nível 1: Resolva os dois enigmas da cena — PIN do celular do Juiz (3330) e a cifra do duto técnico (UBNCPS -1 → TAMBOR).',
                'Nível 2: Examine a Análise Forense do Vídeo (E5): há um relógio analógico atrás de Domingos Karvalho denunciando o horário real da filmagem!',
                'Nível 3: Domingos Karvalho (o líder oculto de Tung Tung Tung Sahur) usou a zarabatana com dardo neurotóxico pelo duto e forjou o álibi com o vídeo pré-gravado (E5).'
            ],
            accusationOptions: {
                methods: [
                    { id: 'neurotoxic_dart_duct', label: 'Disparo de dardo neurotóxico com zarabatana pelo duto superior após replay forjado' },
                    { id: 'server_electrocution', label: 'Sobrecarga elétrica remota disparada da sala de servidores' },
                    { id: 'cyanide_coffee', label: 'Cianeto misturado ao café pela secretária' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Análise Forense do Vídeo (relógio de parede marcando 01h15 durante suposta live de 03h33)' },
                    { id: 'e4', label: 'E4 — Log do Técnico Jonas apagando multas' },
                    { id: 'e2', label: 'E2 — Fotos Vazadas por Lívia às 02h55' },
                    { id: 'e3', label: 'E3 — Registro Contínuo da Central de Rádios' }
                ]
            },
            solution: {
                culpritId: 'sahur',
                methodId: 'neurotoxic_dart_duct',
                alibiBreakerId: 'e5',
                syndicateClue: 'SINDICATO DESMANTELADO: O império de Tung Tung Tung Sahur foi encerrado com todas as provas dos 7 dossiês!',
                explanation:
                    'Desde a relojoaria até a rádio, cada crime financiava ou protegia o império oculto de Domingos "Tung Tung Tung Sahur" Karvalho (E6). Lívia apenas vazou prévias (E2), Jonas apagava multas no subsolo (E4) e Heitor estava com quatro agentes (E3). Sahur gravou sua palestra às 01h15 e agendou o replay para as 03h33 (E4, E5), subiu ao duto técnico, deu as três batidas rituais com sua baqueta de teca e disparou o dardo neurotóxico pela grelha (E1, E7, E8). O relógio analógico no fundo do vídeo (E5) destruiu seu álibi perfeito.',
                wrongEndings: {
                    livia: {
                        title: 'Vazamento Punido, Mestre do Sindicato Foragido!',
                        text: 'Lívia respondeu pelo vazamento às 02h55, mas seu álibi no refeitório às 03h33 foi inabalável. Domingos Karvalho embarcou em um jatinho particular antes do amanhecer.'
                    },
                    jonas: {
                        title: 'Hacker Detido por Multas, Líder Livre!',
                        text: 'Você prendeu o técnico por fraudar multas de trânsito no servidor (E4), mas o log provou que o comando do vídeo partiu do Auditório às 03h20. O Sindicato permaneceu intacto.'
                    },
                    heitor: {
                        title: 'Confronto Sem Provas Contra a Escolta',
                        text: 'Os áudios da central de rádios (E3) e quatro testemunhas inocentaram o comandante imediatamente, atrasando a prisão do verdadeiro líder.'
                    },
                    marta: {
                        title: 'Erro Contra Escrivã Veterana',
                        text: 'As catracas eletrônicas provaram que Marta não deixou o térreo durante toda a madrugada.'
                    },
                    _partial: {
                        title: 'Quase Lá! Feche a Brecha Jurídica Contra Karvalho',
                        text: 'Você cercou o líder do Sindicato, mas para derrubar sua defesa milionária precisa marcar a zarabatana pelo duto E a Análise Forense do Vídeo (E5).'
                    },
                    _default: {
                        title: 'Inquérito Contestado no Palácio',
                        text: 'Confira o relógio de parede no vídeo E5 e a arma escondida no duto E7.'
                    }
                }
            }
        },

        /* ===================== CASO PARALELO 1 ===================== */
        {
            id: 'caso-p01',
            order: 101,
            act: 'Caso Paralelo • Dossiê Avulso',
            isParallel: true,
            isTutorial: false,
            unlockRequires: null,
            code: 'PARALELO #01',
            title: 'O Silêncio no Conservatório',
            difficulty: 'Dificuldade: Moderada',
            victim: 'Maestro Henrique Lemos (59 anos, regente titular do Conservatório Municipal)',
            location: 'Sala de Concertos & Camarim — Conservatório Municipal',
            timeOfDeath: 'Entre 20h10 e 20h30 (batuta partida às 20h22)',
            crimeWindowLabel: 'JANELA DA MORTE: 20h10 – 20h30 (Impacto registrado às 20h22)',
            summary:
                'Durante o intervalo de um ensaio geral fechado, o renomado Maestro Henrique Lemos foi encontrado caído atrás do pódio de regência com um golpe fatal na têmpora. O cofre de partituras raras no camarim estava trancado por um cadeado de 4 discos, enquanto o gravador técnico da coxia continuou ligado por engano.',
            hotspots: [
                {
                    id: 'stage',
                    x: 155, y: 100,
                    label: 'Pódio de Regência & Partitura',
                    detail: 'Ao lado da batuta partida às 20h22 há manchas de resina metálica e a Partitura Anotada do Maestro com quatro compassos circulados em vermelho: 4, 8, 1 e 6 (E2).',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'dressing',
                    x: 330, y: 88,
                    label: 'Camarim & Cofre de Partituras',
                    detail: 'Cofre mecânico com 4 discos giratórios guardando o dossiê confidencial do Maestro. Dica em E2: os 4 números de compassos circulados em vermelho (4-8-1-6).',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-p01',
                        type: 'dial_lock',
                        title: 'Cadeado de 4 Discos do Camarim',
                        prompt: 'Alinhe os 4 discos giratórios conforme os compassos destacados pelo Maestro em E2.',
                        clueRef: 'Consulte a Partitura Anotada (E2): compassos circulados em ordem 4-8-1-6.',
                        answer: '4816',
                        unlocksEvidences: ['e5']
                    }
                },
                {
                    id: 'booth',
                    x: 105, y: 195,
                    label: 'Cabine Técnica de Som',
                    detail: 'Você extrai o Log Digital da Mesa de Som e o áudio contínuo da coxia (E3), além de um recibo de casa de penhores deixado no bolso de uma capa de violoncelo (E4).',
                    unlocksEvidences: ['e3', 'e4']
                },
                {
                    id: 'foyer',
                    x: 335, y: 198,
                    label: 'Saguão & Portaria Principal',
                    detail: 'Gravação da câmera do saguão acompanhando a recepção de patrocinadores das 20h05 às 20h35 (E6).',
                    unlocksEvidences: ['e6']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#141c23"/>
                    <rect x="24" y="24" width="392" height="202" fill="rgba(42,68,86,0.2)" stroke="#85b5cc" stroke-width="2.5"/>
                    <rect x="55" y="48" width="195" height="92" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="152" y="90" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">PALCO &amp; PÓDIO</text>
                    <text x="152" y="104" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Corpo do Maestro)</text>
                    <rect x="274" y="48" width="122" height="82" fill="#23323b" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="335" y="84" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">CAMARIM</text>
                    <text x="335" y="98" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(Cofre 4 Discos)</text>
                    <rect x="46" y="162" width="140" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="116" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">CABINE DE SOM</text>
                    <rect x="274" y="162" width="122" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="335" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">SAGUÃO / PORTARIA</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'otavio',
                    name: 'Otávio Meireles',
                    age: 38,
                    role: 'Compositor assistente',
                    profile: 'Perfeccionista, ambicioso e autor da sinfonia que estrearia no sábado.',
                    statement:
                        'Fiquei trancado na Cabine de Som calibrando canais de microfone sem parar das 20h00 às 20h40! Não desci ao palco nem por um instante.',
                    alibi: 'Afirma ter operado a mesa de som continuamente das 20h00 às 20h40.',
                    portrait: 'man_glasses',
                    questions: [
                        { id: 'q1', q: 'Como o Maestro reagiu aos últimos ensaios da sua sinfonia?', a: 'Ele era exigente com todos, mas nossa parceria era exemplar.', mood: 'calm' },
                        { id: 'q2', q: 'Você usou o metrônomo de bronze do palco hoje?', a: 'Nunca toco em instrumentos do pódio. Meu trabalho é só na cabine técnica.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Otávio arregala os olhos ao ouvir a análise da mesa: "O console ficou sem nenhum comando entre 20h14 e 20h28?! E o microfone da coxia captou o rangido do meu sapato atrás do pódio às 20h21?! Eu... eu desci só para buscar uma folha caída!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e5',
                            response:
                                'Otávio cerra os dentes: "Aquele velho ia ler a carta de plágio diante da imprensa amanhã e encerrar minha carreira! Sem o peso de bronze nas minhas mãos, você não prova que eu o atingi!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Otávio ajusta os óculos friamente: "Isso não abala meu trabalho na cabine de som."',
                    wrongMood: 'calm'
                },
                {
                    id: 'alice',
                    name: 'Alice Rezende',
                    age: 27,
                    role: 'Violoncelista solista',
                    profile: 'Talentosa, endividada após cirurgia familiar; entrou nervosa nos bastidores antes do intervalo.',
                    statement:
                        'Depois que o ensaio parou às 20h00, fui direto à sala de afinação e não cruzei a coxia até a gritaria às 20h35.',
                    alibi: 'Alega não ter passado pela coxia nem pelo armário de instrumentos durante o intervalo.',
                    portrait: 'woman_artist',
                    questions: [
                        { id: 'q1', q: 'Por que você discutiu com o Maestro antes do ensaio?', a: 'Ele notou que eu estava tocando com um arco reserva, nada demais...', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Alice abaixa o olhar e confessa: "Sim, penhorei o arco reserva do Conservatório para pagar o hospital da minha mãe e fui às 20h08 trocar a etiqueta no armário! Mas quando voltei ao corredor às 20h24, vi o Otávio saindo apressado da coxia limpando um peso de bronze de metrônomo com o lenço!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Alice respira fundo: "Eu jamais machucaria o Maestro Henrique, detetive."',
                    wrongMood: 'nervous'
                },
                {
                    id: 'claudia',
                    name: 'Cláudia Ferraz',
                    age: 46,
                    role: 'Diretora administrativa',
                    profile: 'Pragmática; discordava dos gastos do Maestro com concertos gratuitos.',
                    statement:
                        'Recebi quatro patrocinadores no Saguão Principal das 20h05 às 20h35. A câmera da portaria filmou toda a conversa.',
                    alibi: 'Confirmada em vídeo no saguão principal das 20h05 às 20h35.',
                    portrait: 'woman_bun',
                    questions: [
                        { id: 'q1', q: 'Havia alguma denúncia interna contra membros da orquestra?', a: 'O Maestro guardava cartas delicadas no cofre do camarim usando compassos musicais como senha.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e6',
                            response:
                                'Cláudia aponta o monitor com tranquilidade: "Trinta minutos ininterruptos na portaria diante de quatro testemunhas. Meu álibi é absoluto."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Cláudia franze o cenho: "Disputas orçamentárias não se resolvem com violência."',
                    wrongMood: 'furious'
                },
                {
                    id: 'dario',
                    name: 'Dário Santana',
                    age: 52,
                    role: 'Afinador de pianos',
                    profile: 'Discreto, trabalha há 18 anos nos porões acústicos do teatro.',
                    statement:
                        'Fiquei no depósito do subsolo trocando cordas até 20h32. Só ouvi um som seco metálico pelo duto de ar perto das 20h22.',
                    alibi: 'Trabalhava no depósito com registro de ponto de oficina.',
                    portrait: 'man_beard',
                    questions: [
                        { id: 'q1', q: 'O som metálico parecia vir do palco?', a: 'Sim, parecia o peso maciço do metrônomo de bronze batendo contra o piso de jacarandá.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e2',
                            response:
                                'Dário examina a partitura: "Esses quatro compassos circulados em vermelho (4-8-1-6) são o jeito clássico do Maestro anotar a combinação do cofre do camarim!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Dário balança a cabeça: "Não sei o que isso tem a ver com meu trabalho nas cordas."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Pericial do Palco',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame preliminar do corpo e da área do pódio de regência.',
                    doc: 'CAUSA DA MORTE: Traumatismo craniano na têmpora causado por objeto cilíndrico denso de bronze (compatível com peso removível de metrônomo antigo).\nHORA ESTIMADA: 20h10 – 20h30 (batuta partida sob o corpo às 20h22).'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Partitura Anotada do Maestro',
                    type: 'message',
                    initial: false,
                    foundAtHotspot: 'stage',
                    desc: 'Recolhida na estante do pódio ao lado da batuta quebrada.',
                    doc: 'PARTITURA DA ESTREIA: Quatro números de compasso circulados em tinta vermelha no topo: *4*, *8*, *1*, *6*.\nNOTA DE RODAPÉ: "Dossiê do plágio trancado no cofre de 4 discos do camarim."'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Log da Cabine de Som & Áudio da Coxia',
                    type: 'audio',
                    initial: false,
                    foundAtHotspot: 'booth',
                    desc: 'Auditoria da mesa digital e microfone ambiente da coxia deixado aberto.',
                    doc: 'LOG DA MESA (OPERADOR OTÁVIO):\n20h14 -> Último ajuste registrado na cabine.\n20h14 às 20h28 -> ZERO atividade no console!\nÁUDIO DA COXIA [20h21]: Passos com rangido característico de sola de couro atrás do pódio + baque seco às 20h22.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Recibo de Casa de Penhores',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'booth',
                    desc: 'Comprovante em nome de Alice Rezende referente a um arco de violoncelo.',
                    doc: 'DELITO MENOR: Alice penhorou um arco reserva do Conservatório para despesas médicas.\nCÂMERA DO CORREDOR: Alice entrou na sala de afinação às 20h10 e só reapareceu no corredor às 20h24.'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Dossiê de Plágio Musical (Cofre)',
                    type: 'cipher',
                    initial: false,
                    foundAtHotspot: 'dressing',
                    desc: 'Desbloqueado no cofre de 4 discos (4-8-1-6) do camarim.',
                    doc: 'COMUNICADO PRONTO PARA IMPRENSA (ASS. MAESTRO HENRIQUE):\n"A sinfonia assinada por Otávio Meireles foi copiada integralmente de manuscritos inéditos de 1948. Cancelarei a estreia e solicitarei sua demissão por justa causa amanhã."'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Câmera do Saguão Principal',
                    type: 'photo',
                    initial: false,
                    foundAtHotspot: 'foyer',
                    desc: 'Vídeo contínuo da recepção de patrocinadores.',
                    doc: '20h05 às 20h35 -> Diretora Cláudia Ferraz permanece em quadro contínuo conversando com 4 patrocinadores no saguão.'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Testemunho de Alice no Corredor (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtido ao confrontar Alice com o recibo de penhor (E4).',
                    doc: 'DEPOIMENTO DE ALICE: Às 20h24 viu Otávio Meireles sair apressado da coxia escondendo um peso de bronze de metrônomo no bolso do casaco.'
                }
            ],
            timeline: [
                { time: '20h05', text: 'Cláudia recebe patrocinadores no Saguão Principal (filmada até 20h35).', source: 'Evidência E6', requiresEvidence: 'e6', crimeWindow: false },
                { time: '20h08', text: 'Alice troca etiqueta no armário de instrumentos após penhorar o arco reserva.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: false },
                { time: '20h14', text: 'Mesa de som na Cabine para completamente de receber comandos de Otávio.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: true },
                { time: '20h21', text: 'Microfone da coxia capta passos de sola de couro aproximando-se do pódio.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: true },
                { time: '20h22', text: 'Baque metálico seco; Maestro Henrique morre atrás do pódio.', source: 'Evidências E1 & E3', crimeWindow: true },
                { time: '20h24', text: 'Alice vê Otávio deixando a coxia com o peso de bronze do metrônomo.', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: true },
                { time: '20h28', text: 'Mesa da Cabine de Som volta a registrar atividade.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:otavio', to: 'evidence:e3', relation: 'contradiz', insight: 'A inatividade da mesa de som (20h14–20h28) e o áudio da coxia derrubam o álibi de Otávio!' },
                { from: 'suspect:otavio', to: 'evidence:e5', relation: 'motivo', insight: 'O Maestro ia expor o plágio da sinfonia de Otávio no dia seguinte.' },
                { from: 'suspect:claudia', to: 'evidence:e6', relation: 'confirma', insight: 'A câmera do saguão (20h05–20h35) inocenta completamente Cláudia.' }
            ],
            hints: [
                'Nível 1: Colete a Partitura Anotada (E2) no palco e use os 4 números circulados (4-8-1-6) no cadeado de 4 discos do camarim.',
                'Nível 2: Confronte Alice com E4 para descobrir quem ela viu às 20h24, e verifique a lacuna de atividade no log da Cabine de Som (E3).',
                'Nível 3: Otávio Meireles atacou o Maestro com o peso de bronze do metrônomo para ocultar o plágio (E5); o Log da Cabine (E3) destrói seu álibi.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'metronome_weight', label: 'Golpe fatal na têmpora com peso de bronze de metrônomo atrás do pódio' },
                    { id: 'piano_wire', label: 'Estrangulamento silencioso com corda de piano na coxia' },
                    { id: 'tea_poison', label: 'Envenenamento por sedativo diluído na garrafa térmica do camarim' }
                ],
                alibiBreakers: [
                    { id: 'e3', label: 'E3 — Log da Cabine de Som (inativa 20h14–20h28) e Áudio da Coxia às 20h21' },
                    { id: 'e4', label: 'E4 — Recibo de Casa de Penhores de Alice Rezende' },
                    { id: 'e6', label: 'E6 — Câmera Contínua do Saguão Principal' }
                ]
            },
            solution: {
                culpritId: 'otavio',
                methodId: 'metronome_weight',
                alibiBreakerId: 'e3',
                syndicateClue: 'Dossiê paralelo encerrado — crime motivado por fraude artística independente da força-tarefa principal.',
                explanation:
                    'O Maestro Henrique havia descoberto que a grande estreia de Otávio Meireles era um plágio integral e preparava sua demissão (E5). Cláudia estava filmada no saguão (E6) e Alice apenas escondia o penhor do arco reserva (E4), tendo visto Otávio às 20h24 (E7). O log digital da Cabine de Som (E3) provou que Otávio abandonou o console entre 20h14 e 20h28, desceu à coxia e golpeou o Maestro com o peso de bronze do metrônomo às 20h22.',
                wrongEndings: {
                    alice: {
                        title: 'Violoncelista Detida, Plagiador Livre',
                        text: 'Alice confessou o penhor do arco, mas as câmeras comprovaram que ela não esteve na coxia às 20h22. Otávio queimou os manuscritos originais antes que o erro fosse corrigido.'
                    },
                    claudia: {
                        title: 'Álibi em Vídeo Derruba o Mandado',
                        text: 'Quatro patrocinadores e a câmera contínua do saguão (E6) inocentaram a diretora em minutos, paralisando a investigação.'
                    },
                    dario: {
                        title: 'Erro Contra o Afinador Veterano',
                        text: 'O registro da oficina no subsolo provou que Dário nunca subiu ao palco naquela noite.'
                    },
                    _partial: {
                        title: 'Mandado Tecnicamente Incompleto',
                        text: 'Otávio é o culpado, mas a promotoria exige a arma correta (peso de bronze do metrônomo) e a quebra de álibi E3.'
                    },
                    _default: {
                        title: 'Inquérito Contestado no Conservatório',
                        text: 'Revise o cofre de 4 discos (4816) e o log da Cabine de Som (E3).'
                    }
                }
            }
        },

        /* ===================== CASO PARALELO 2 ===================== */
        {
            id: 'caso-p02',
            order: 102,
            act: 'Caso Paralelo • Dossiê Avulso',
            isParallel: true,
            isTutorial: false,
            unlockRequires: null,
            code: 'PARALELO #02',
            title: 'A Última Edição da Tipografia',
            difficulty: 'Dificuldade: Difícil',
            victim: 'Beatriz Nogueira (48 anos, editora-chefe do jornal A Folha do Cais)',
            location: 'Galpão da Prensa Rotativa — Tipografia Histórica',
            timeOfDeath: 'Entre 23h15 e 23h35 (prensa travada às 23h26)',
            crimeWindowLabel: 'JANELA DA MORTE: 23h15 – 23h35 (Freio sabotado às 23h26)',
            summary:
                'Pouco antes do fechamento da edição da meia-noite, a editora-chefe Beatriz Nogueira foi morta junto à prensa rotativa após sofrer um golpe e ter o freio de segurança desarmado para simular acidente industrial. Um armário de tipos metálicos guarda chapas clandestinas protegidas por uma trava cifrada.',
            hotspots: [
                {
                    id: 'press',
                    x: 155, y: 95,
                    label: 'Prensa Rotativa & Freio',
                    detail: 'A alavanca do freio apresenta manchas frescas de tinta metálica prata e um retalho de luva de couro (E2). O laudo descarta acidente fortuito.',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'cabinet',
                    x: 325, y: 88,
                    label: 'Armário de Tipos Móveis (Cifra)',
                    detail: 'Gaveta trancada com código alfabético deslocado +1: "QSFOTB". Recue 1 letra no alfabeto para descobrir a palavra-chave.',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-p02',
                        type: 'cipher',
                        title: 'Trava Cifrada do Armário de Chapas',
                        prompt: 'Decifre "QSFOTB" deslocando cada letra 1 posição para trás no alfabeto (B→A).',
                        clueRef: 'Q→P, S→R, F→E, O→N, T→S, B→A.',
                        cipherText: 'QSFOTB',
                        cipherHint: 'Deslocamento -1 (César)',
                        answer: 'PRENSA',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'newsroom',
                    x: 105, y: 196,
                    label: 'Redação & Relógio de Ponto',
                    detail: 'Você recolhe o Log Eletrônico da Grade de Segurança da Prensa (E5) e o recibo com GPS do táxi utilizado por Marina (E3).',
                    unlocksEvidences: ['e5', 'e3']
                },
                {
                    id: 'dispatch',
                    x: 335, y: 196,
                    label: 'Expedição dos Fundos',
                    detail: 'Canhoto rasgado comprovando a venda clandestina de bobinas de papel-jornal por Tiago (E4).',
                    unlocksEvidences: ['e4']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#151d24"/>
                    <rect x="24" y="24" width="392" height="202" fill="rgba(42,68,86,0.2)" stroke="#85b5cc" stroke-width="2.5"/>
                    <rect x="55" y="48" width="195" height="90" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="152" y="88" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="10">PRENSA ROTATIVA</text>
                    <text x="152" y="102" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="8">(Freio Sabotado)</text>
                    <rect x="272" y="48" width="124" height="82" fill="#23323b" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="334" y="84" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">ARMÁRIO TIPOS</text>
                    <text x="334" y="98" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(Trava Cifrada)</text>
                    <rect x="46" y="162" width="142" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="117" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">REDAÇÃO / PONTO</text>
                    <rect x="272" y="162" width="124" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="334" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">EXPEDIÇÃO</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'rubens',
                    name: 'Rubens Azevedo',
                    age: 51,
                    role: 'Mestre impressor-chefe',
                    profile: 'Veterano, único autorizado a operar chapas metálicas especiais fora do expediente.',
                    statement:
                        'Bati meu ponto às 23h00 em ponto e fui direto para casa dormir! Não voltei à área da prensa rotativa depois das onze da noite.',
                    alibi: 'Afirma ter deixado a gráfica às 23h00 sem retornar à prensa.',
                    portrait: 'man_hat',
                    questions: [
                        { id: 'q1', q: 'Por que existe tinta metálica prata na gráfica?', a: 'Usamos só em convites comemorativos raros... e tranco esse estoque no meu armário.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Rubens empalidece ao ver a leitura do crachá: "A grade da prensa registrou meu crachá às 23h19 e saída às 23h31?! Alguém deve ter pegado meu cartão... Eu estava em casa!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Rubens bate a palma na mesa: "Beatriz ia chamar a Polícia Federal por causa dessas matrizes de títulos falsificados! Vinte anos limpando máquina para nada!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Rubens balança a cabeça: "Acidentes com prensa acontecem quando gente de redação entra sem saber mexer no freio."',
                    wrongMood: 'calm'
                },
                {
                    id: 'tiago',
                    name: 'Tiago Furtado',
                    age: 29,
                    role: 'Auxiliar de expedição',
                    profile: 'Impulsivo; desviava bobinas de papel excedentes para gráficas pequenas.',
                    statement:
                        'Fiquei carregando jornais antigos no pátio até 23h40 e nem entrei no salão da prensa.',
                    alibi: 'Alega ter ficado apenas no pátio de carga.',
                    portrait: 'man_beard',
                    questions: [
                        { id: 'q1', q: 'Você viu alguém lavando luvas ou ferramentas perto das 23h30?', a: 'Só vou falar se você provar que eu estava fora do pátio, detetive.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Tiago sua frio e confessa: "Certo, eu vendi quatro bobinas de papel por fora no portão dos fundos às 23h22 — o comprador assinou o canhoto naquela hora! Quando voltei pelo corredor às 23h29, vi o Rubens jogando solvente numa luva manchada de tinta prata perto do tanque!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Tiago encolhe os ombros: "Não entendo nada de chapa nem de freio rotativo."',
                    wrongMood: 'nervous'
                },
                {
                    id: 'marina',
                    name: 'Marina Caldas',
                    age: 34,
                    role: 'Repórter investigativa',
                    profile: 'Intensa; discordou de Beatriz no fechamento sobre uma pauta política.',
                    statement:
                        'Saí da redação irritada às 23h05, peguei um táxi rastreado até a Câmara Municipal e só retornei às 23h45.',
                    alibi: 'Trajeto em táxi rastreado por GPS a 9 km da gráfica das 23h05 às 23h45.',
                    portrait: 'woman_scarf',
                    questions: [
                        { id: 'q1', q: 'Beatriz comentou sobre alguma descoberta na gráfica antes de você sair?', a: 'Disse que ia conferir um armário de tipos com senha cifrada porque achou tinta prata fora de inventário.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Marina sorri aliviada: "Recibo e GPS contínuo atravessando a cidade entre 23h05 e 23h45. Impossível eu estar perto da prensa."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Marina cruza os braços: "Brigar por manchete faz parte do jornalismo, não de assassinato."',
                    wrongMood: 'furious'
                },
                {
                    id: 'celio',
                    name: 'Célio Pacheco',
                    age: 61,
                    role: 'Revisor veterano',
                    profile: 'Calmo e metódico; trabalhava na sala de revisão junto à portaria.',
                    statement:
                        'Fiquei na mesa da portaria revisando provas com o vigia noturno das 23h00 às 23h40. Vi a Marina sair às 23h05.',
                    alibi: 'Acompanhado pelo vigia noturno na portaria.',
                    portrait: 'man_suit',
                    questions: [
                        { id: 'q1', q: 'O senhor viu o Rubens ir embora às 23h00?', a: 'Vi ele bater o ponto da portaria, mas existe uma porta lateral de carga que dá acesso direto à grade da prensa.', mood: 'calm' }
                    ],
                    confrontations: [],
                    wrongConfront: 'Célio ajusta os óculos: "Meu trabalho é revisar vírgulas, detetive."',
                    wrongMood: 'calm'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo Técnico da Prensa & IML',
                    type: 'forensic',
                    initial: true,
                    desc: 'Perícia no corpo de Beatriz e na mecânica da prensa rotativa.',
                    doc: 'CAUSA DA MORTE: Golpe contundente na nuca (chave inglesa pesada) seguido por desarme deliberado do freio da prensa às 23h26 para simular acidente.'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Tinta Metálica Prata & Luva Rasgada',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'press',
                    desc: 'Vestígios coletados na alavanca do freio sabotado.',
                    doc: 'VESTÍGIO: Manchas frescas de tinta metálica prata de segurança (usada exclusivamente em matrizes especiais) + fragmento de luva de couro tamanho G.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Recibo e Telemetria GPS do Táxi',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'newsroom',
                    desc: 'Comprovante eletrônico da corrida de Marina Caldas.',
                    doc: 'PASSAGEIRA: Marina Caldas\nEMBARQUE: 23h06 na gráfica -> DESTINO: Câmara Municipal (9 km).\nRETORNO: 23h45.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Canhoto Clandestino de Bobinas',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'dispatch',
                    desc: 'Recibo rasgado escondido sob paletes na Expedição.',
                    doc: 'DELITO MENOR: Tiago entregou 4 bobinas de papel-jornal a um comprador no portão dos fundos às 23h22 (assinatura e câmera do pátio confirmam presença externa até 23h28).'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Log da Grade Eletrônica da Prensa',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'newsroom',
                    desc: 'Controle automático da grade metálica que isola a prensa rotativa.',
                    doc: '23h00 -> Rubens bateu ponto de saída na portaria.\n23h19 -> CRACHÁ #01 (Rubens Azevedo) abriu a grade da prensa rotativa!\n23h31 -> CRACHÁ #01 fechou a grade da prensa.'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Matrizes de Títulos Falsos (Decifrado)',
                    type: 'cipher',
                    initial: false,
                    foundAtHotspot: 'cabinet',
                    desc: 'Encontrado no armário após decifrar QSFOTB → PRENSA.',
                    doc: 'CONTEÚDO: Chapas gravadas com tinta metálica prata para impressão clandestina de títulos públicos falsificados.\nCADERNO ANEXO: Assinaturas de controle de tiragem do mestre impressor Rubens Azevedo.'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Relato do Tanque de Solvente (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtido ao confrontar Tiago com o canhoto de bobinas (E4).',
                    doc: 'DEPOIMENTO DE TIAGO: Às 23h29 viu Rubens lavando com solvente uma luva de couro rasgada coberta de tinta metálica prata.'
                }
            ],
            timeline: [
                { time: '23h00', text: 'Rubens bate ponto de saída na portaria principal para forjar álibi.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: false },
                { time: '23h06', text: 'Marina embarca no táxi rastreado rumo à Câmara Municipal.', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: false },
                { time: '23h19', text: 'Crachá #01 de Rubens abre a grade da prensa rotativa pelos fundos.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '23h22', text: 'Tiago entrega bobinas desviadas no portão externo do pátio.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '23h26', text: 'Beatriz é golpeada e o freio da prensa é sabotado deixando tinta prata.', source: 'Evidências E1 & E2', crimeWindow: true },
                { time: '23h29', text: 'Tiago vê Rubens tentando limpar luva com tinta prata no tanque.', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: true },
                { time: '23h31', text: 'Crachá #01 fecha a grade da prensa rotativa.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:rubens', to: 'evidence:e5', relation: 'contradiz', insight: 'O crachá #01 na grade da prensa (23h19–23h31) desmente que Rubens foi para casa às 23h00!' },
                { from: 'suspect:rubens', to: 'evidence:e6', relation: 'motivo', insight: 'As chapas de títulos falsos com tinta prata ligavam Rubens à falsificação.' },
                { from: 'suspect:marina', to: 'evidence:e3', relation: 'confirma', insight: 'O GPS do táxi das 23h06 às 23h45 inocenta Marina.' }
            ],
            hints: [
                'Nível 1: Decifre o armário de tipos deslocando QSFOTB uma letra para trás (PRENSA) para descobrir o motivo real do crime.',
                'Nível 2: Confronte Tiago com E4 para liberar o testemunho do tanque de solvente e examine o log da grade da prensa (E5).',
                'Nível 3: Rubens Azevedo retornou pelos fundos entre 23h19 e 23h31 (E5) para silenciar Beatriz e proteger as chapas falsas (E6).'
            ],
            accusationOptions: {
                methods: [
                    { id: 'press_sabotage', label: 'Golpe contundente seguido de sabotagem deliberada do freio da prensa rotativa' },
                    { id: 'solvent_fumes', label: 'Intoxicação por vapores de solvente trancando a sala de revisão' },
                    { id: 'paper_fall', label: 'Queda provocada de bobinas de papel-jornal na expedição' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Log da Grade Eletrônica da Prensa (crachá #01 de Rubens às 23h19–23h31)' },
                    { id: 'e4', label: 'E4 — Canhoto Clandestino de Venda de Bobinas' },
                    { id: 'e3', label: 'E3 — Recibo e GPS do Táxi de Marina' }
                ]
            },
            solution: {
                culpritId: 'rubens',
                methodId: 'press_sabotage',
                alibiBreakerId: 'e5',
                syndicateClue: 'Dossiê paralelo encerrado — esquema local de falsificação gráfica desarticulado na Tipografia.',
                explanation:
                    'Beatriz descobriu que Rubens Azevedo usava a gráfica de madrugada com tinta metálica prata para imprimir títulos falsificados (E2, E6). Marina estava em um táxi rastreado por GPS (E3) e Tiago desviava bobinas no portão externo às 23h22 (E4), flagrando Rubens lavando a luva com tinta prata às 23h29 (E7). Apesar de bater o ponto na portaria às 23h00, o log da grade da prensa (E5) provou a presença de Rubens lá entre 23h19 e 23h31.',
                wrongEndings: {
                    tiago: {
                        title: 'Furto de Papel Punido, Falsificador Foragido',
                        text: 'Tiago admitiu a venda das bobinas, mas o comprador confirmou sua presença no portão externo às 23h22. Rubens derreteu as matrizes clandestinas antes do amanhecer.'
                    },
                    marina: {
                        title: 'GPS do Táxi Derruba a Acusação',
                        text: 'A central de táxis enviou o trajeto completo em minutos, inocentando a repórter e dando tempo para o culpado desaparecer.'
                    },
                    celio: {
                        title: 'Mandado Anulado pela Portaria',
                        text: 'O vigia noturno confirmou que Célio não saiu da sala de revisão durante toda a janela crítica.'
                    },
                    _partial: {
                        title: 'Culpado Correto, Detalhe Técnico Incompleto',
                        text: 'Rubens é o assassino, mas o juiz exige o método exato (golpe + sabotagem do freio) e o log E5.'
                    },
                    _default: {
                        title: 'Inquérito Contestado na Gráfica',
                        text: 'Decifre a trava PRENSA e confira o log eletrônico da grade (E5).'
                    }
                }
            }
        },

        /* ===================== CASO PARALELO 3 ===================== */
        {
            id: 'caso-p03',
            order: 103,
            act: 'Caso Paralelo • Dossiê Avulso',
            isParallel: true,
            isTutorial: false,
            unlockRequires: null,
            code: 'PARALELO #03',
            title: 'Nevoeiro no Farol da Ponta Negra',
            difficulty: 'Dificuldade: Muito Difícil',
            victim: 'Comandante Eurico Bastos (63 anos, faroleiro-chefe da Ponta Negra)',
            location: 'Torre do Farol & Cais de Pedra — Ponta Negra',
            timeOfDeath: 'Entre 04h05 e 04h25 (lâmpada do farol apagada às 04h15)',
            crimeWindowLabel: 'JANELA DA MORTE: 04h05 – 04h25 (Apagão da lanterna às 04h15)',
            summary:
                'Sob nevoeiro fechado, o feixe do Farol da Ponta Negra apagou exatamente às 04h15. Quando o gerador reserva entrou, o Comandante Eurico Bastos jazia sem vida na base da escada da lanterna, com o cabo principal seccionado por alicate de corte. O rádio marítimo gravou uma transmissão de socorro antes de travar por PIN.',
            hotspots: [
                {
                    id: 'lantern',
                    x: 155, y: 88,
                    label: 'Sala da Lanterna & Cabo Cortado',
                    detail: 'O cabo do gerador foi cortado com precisão cirúrgica às 04h15, deixando lascas de tinta amarela de capa impermeável no corrimão (E2).',
                    unlocksEvidences: ['e2']
                },
                {
                    id: 'radio',
                    x: 328, y: 88,
                    label: 'Mesa do Rádio Marítimo (PIN)',
                    detail: 'Gravador de caixa-preta travado por PIN de 4 dígitos. Anotação da esposa Inês: "Eurico sempre tranca o log com a hora exata da queda de energia" (0415).',
                    unlocksEvidences: [],
                    puzzle: {
                        id: 'puz-p03',
                        type: 'phone_pin',
                        title: 'Caixa-Preta do Rádio Marítimo',
                        prompt: 'Digite o PIN de 4 dígitos (HHMM) correspondente ao minuto exato em que o farol apagou.',
                        clueRef: 'Veja o Laudo E1: horário exato do apagão da lanterna (04h15 → 0415).',
                        answer: '0415',
                        unlocksEvidences: ['e6']
                    }
                },
                {
                    id: 'pier',
                    x: 105, y: 196,
                    label: 'Cais de Pedra & Boia Costeira',
                    detail: 'Você baixa a Telemetria do Radar Costeiro e da Boia Acústica (E5) e o registro de plantão da Capitania dos Portos (E3).',
                    unlocksEvidences: ['e5', 'e3']
                },
                {
                    id: 'quarters',
                    x: 335, y: 196,
                    label: 'Alojamento & Tanque de Diesel',
                    detail: 'Caderno de apostas e mangueira escondida comprovando que Ernesto desviava diesel do gerador auxiliar (E4).',
                    unlocksEvidences: ['e4']
                }
            ],
            floorplanSvg: `
                <svg class="floorplan-svg" viewBox="0 0 440 250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="440" height="250" fill="#101a21"/>
                    <rect x="24" y="24" width="392" height="202" fill="rgba(35,62,82,0.22)" stroke="#85b5cc" stroke-width="2.5"/>
                    <circle cx="155" cy="92" r="46" fill="rgba(158,27,27,0.28)" stroke="#d46363" stroke-width="2"/>
                    <text x="155" y="88" text-anchor="middle" fill="#ffd2d2" font-family="monospace" font-size="9">TORRE LANTERNA</text>
                    <text x="155" y="102" text-anchor="middle" fill="#ffb0b0" font-family="monospace" font-size="7">(Apagão 04h15)</text>
                    <rect x="268" y="48" width="128" height="82" fill="#23323b" stroke="#c99e32" stroke-width="1.8"/>
                    <text x="332" y="84" text-anchor="middle" fill="#ebd28c" font-family="monospace" font-size="9">SALA DE RÁDIO</text>
                    <text x="332" y="98" text-anchor="middle" fill="#9cb3bf" font-family="monospace" font-size="7">(PIN 4 Dígitos)</text>
                    <rect x="46" y="162" width="150" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="121" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">CAIS / BOIA RADAR</text>
                    <rect x="268" y="162" width="128" height="52" fill="#1f313d" stroke="#7cb0c9" stroke-width="1.5"/>
                    <text x="332" y="191" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="9">ALOJAMENTO</text>
                    <g id="svg-hotspots"></g>
                </svg>
            `,
            suspects: [
                {
                    id: 'silvia',
                    name: 'Sílvia Maranhão',
                    age: 42,
                    role: 'Engenheira náutica visitante',
                    profile: 'Fria e calculista; comanda uma lancha rápida de inspeção costeira equipada com sonda.',
                    statement:
                        'Por causa do nevoeiro denso, minha lancha permaneceu ancorada na Enseada Calma a 6 km daqui das 03h30 até as 05h00! Não atraquei na Ponta Negra durante a madrugada.',
                    alibi: 'Afirma ter ficado ancorada a 6 km na Enseada Calma das 03h30 às 05h00.',
                    portrait: 'woman_doctor',
                    questions: [
                        { id: 'q1', q: 'Por que Eurico contestou seu relatório de rota costeira ontem?', a: 'Burocracia de marinheiro antigo que não aceita navegação moderna por instrumento.', mood: 'furious' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e5',
                            response:
                                'Sílvia congela diante do gráfico da boia: "O sonar costeiro detectou o casco da minha lancha atracando sem luzes no Cais de Pedra às 04h02 e partindo às 04h28?! Isso... o sensor deve ter confundido com uma baleia ou correnteza!"',
                            unlocksEvidenceId: null,
                            marksContradiction: true,
                            mood: 'sweating'
                        },
                        {
                            evidenceId: 'e6',
                            response:
                                'Sílvia aperta os lábios com raiva: "O rádio gravou Eurico denunciando o canal clandestino da minha lancha?! Se o farol continuasse aceso às 04h15, a guarda costeira teria interceptado o desembarque inteiro!"',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'furious'
                        }
                    ],
                    wrongConfront: 'Sílvia mantém a compostura: "Sem provar que minha embarcação deixou a enseada, isso é pura especulação."',
                    wrongMood: 'calm'
                },
                {
                    id: 'ernesto',
                    name: 'Ernesto Lopes',
                    age: 35,
                    role: 'Ajudante de farol',
                    profile: 'Inseguro; desviava galões de diesel do depósito para quitar dívidas no vilarejo.',
                    statement:
                        'Dormi no alojamento da base das 03h40 até o alarme do gerador soar às 04h24.',
                    alibi: 'Alega não ter saído do alojamento durante a madrugada.',
                    portrait: 'man_keeper',
                    questions: [
                        { id: 'q1', q: 'Você ouviu alguém subir a escada em espiral antes do apagão?', a: 'Estava de porta fechada... não vi ninguém.', mood: 'nervous' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e4',
                            response:
                                'Ernesto abaixa os ombros e confessa: "Está bem! Às 04h10 eu estava no galpão externo enchendo dois galões de diesel para vender no povoado! Mas foi de lá que vi uma mulher de capa impermeável amarela descer correndo a torre às 04h21 segurando um alicate de corte — era a Dra. Sílvia correndo para o cais!"',
                            unlocksEvidenceId: 'e7',
                            marksContradiction: true,
                            mood: 'sweating'
                        }
                    ],
                    wrongConfront: 'Ernesto engole em seco: "Eu jamais sabotaria o farol, o Comandante era como um pai!"',
                    wrongMood: 'nervous'
                },
                {
                    id: 'joao',
                    name: 'Ten. João Paiva',
                    age: 44,
                    role: 'Inspetor da Capitania dos Portos',
                    profile: 'Rigoroso; chefiava o plantão noturno da sede a 14 km do farol.',
                    statement:
                        'Estive no posto da Capitania registrando boletins de tempestade às 04h00, 04h15 e 04h30 com mais dois sargentos.',
                    alibi: 'Registro de plantão assinado e gravado na Capitania (14 km dali).',
                    portrait: 'man_uniform',
                    questions: [
                        { id: 'q1', q: 'Alguém conseguiria navegar no nevoeiro sem o farol aceso?', a: 'Apenas embarcação rápida com sonar de alta precisão e casco escuro — exatamente o perfil da lancha da engenheira Sílvia.', mood: 'calm' }
                    ],
                    confrontations: [
                        {
                            evidenceId: 'e3',
                            response:
                                'Ten. João apresenta o livro oficial: "Boletins transmitidos por voz às 04h00, 04h15 e 04h30 direto da Capitania, a 14 quilômetros."',
                            unlocksEvidenceId: null,
                            marksContradiction: false,
                            mood: 'calm'
                        }
                    ],
                    wrongConfront: 'Ten. João responde seco: "Meu turno está documentado em fita na Capitania."',
                    wrongMood: 'calm'
                },
                {
                    id: 'ines',
                    name: 'Inês Bastos',
                    age: 58,
                    role: 'Esposa do faroleiro',
                    profile: 'Dedicada; morava na casa anexa à base do farol há 25 anos.',
                    statement:
                        'Fiquei na casa da base preparando café até a luz do farol apagar às 04h15 e eu correr para acordar o Ernesto.',
                    alibi: 'Ligou para a emergência às 04h17 da linha fixa da casa anexa.',
                    portrait: 'woman_elder',
                    questions: [
                        { id: 'q1', q: 'Como o Comandante escolhia a senha do rádio de emergência?', a: 'Ele programava o bloqueio automático com os 4 dígitos da hora em que o sistema disparava alerta de apagão.', mood: 'calm' }
                    ],
                    confrontations: [],
                    wrongConfront: 'Inês enxuga os olhos: "Por favor, descubra quem desligou o farol do meu marido."',
                    wrongMood: 'nervous'
                }
            ],
            evidences: [
                {
                    id: 'e1',
                    code: 'E1',
                    title: 'Laudo da Torre & Registro do Apagão',
                    type: 'forensic',
                    initial: true,
                    desc: 'Exame da cena na Sala da Lanterna e da escada em espiral.',
                    doc: 'CAUSA DA MORTE: Queda induzida na passarela superior da lanterna após luta corporal no escuro.\nHORA DO APAGÃO: 04h15 exatas (cabo de energia cortado intencionalmente).'
                },
                {
                    id: 'e2',
                    code: 'E2',
                    title: 'Cabo Seccionado & Lascas Amarelas',
                    type: 'object',
                    initial: false,
                    foundAtHotspot: 'lantern',
                    desc: 'Recolhidos no corrimão da Sala da Lanterna.',
                    doc: 'PROVA FÍSICA: Cabo de cobre cortado por alicate hidráulico portátil + resíduo de tinta/borracha de capa impermeável amarela presa ao ferrolho.'
                },
                {
                    id: 'e3',
                    code: 'E3',
                    title: 'Livro de Plantão da Capitania',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'pier',
                    desc: 'Auditoria oficial das transmissões da sede marítima.',
                    doc: 'TEN. JOÃO PAIVA: Presença contínua e voz gravada na sede (14 km da Ponta Negra) às 04h00, 04h15 e 04h30.'
                },
                {
                    id: 'e4',
                    code: 'E4',
                    title: 'Caderno de Desvio de Diesel',
                    type: 'receipt',
                    initial: false,
                    foundAtHotspot: 'quarters',
                    desc: 'Anotações e galões encontrados atrás do depósito auxiliar.',
                    doc: 'DELITO MENOR: Ernesto desviava 40 litros de diesel por semana. Pegadas frescas ligam o alojamento apenas ao tanque externo (não sobem à torre).'
                },
                {
                    id: 'e5',
                    code: 'E5',
                    title: 'Telemetria da Boia & Radar Costeiro',
                    type: 'log',
                    initial: false,
                    foundAtHotspot: 'pier',
                    desc: 'Dados hidrográficos automáticos do Cais de Pedra da Ponta Negra.',
                    doc: 'DETECÇÃO DE EMBARCAÇÃO (HÉLICE DUPLA — LANCHA DE SÍLVIA):\n04h02 -> Atracação silenciosa no Cais de Pedra com luzes apagadas.\n04h28 -> Partida em alta velocidade rumo à Enseada Calma.'
                },
                {
                    id: 'e6',
                    code: 'E6',
                    title: 'Gravação do Rádio Marítimo (PIN 0415)',
                    type: 'audio',
                    initial: false,
                    foundAtHotspot: 'radio',
                    desc: 'Extraído da caixa-preta com o PIN 0415.',
                    doc: 'VOZ DO CMDT. EURICO [04h14]: "Capitania, aqui é Ponta Negra! Flagrando desembarque clandestino guiado pela lancha da engenheira Sílvia Maranhão — espera, alguém subiu na lanterna com um alicate..." [SOM DE CORTE E QUEDA].'
                },
                {
                    id: 'e7',
                    code: 'E7',
                    title: 'Testemunho da Capa Amarela (Desbloqueado)',
                    type: 'message',
                    secret: true,
                    desc: 'Obtido ao confrontar Ernesto com o desvio de diesel (E4).',
                    doc: 'DEPOIMENTO DE ERNESTO: Às 04h21 viu Sílvia Maranhão descendo a torre de capa impermeável amarela com alicate de corte na mão e correndo até o cais.'
                }
            ],
            timeline: [
                { time: '04h00', text: 'Ten. João transmite boletim de tempestade direto da Capitania (14 km).', source: 'Evidência E3', requiresEvidence: 'e3', crimeWindow: false },
                { time: '04h02', text: 'Boia acústica registra a lancha de Sílvia atracando no escuro no Cais de Pedra.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true },
                { time: '04h10', text: 'Ernesto sai discretamente ao tanque externo desviar galões de diesel.', source: 'Evidência E4', requiresEvidence: 'e4', crimeWindow: true },
                { time: '04h14', text: 'Eurico inicia denúncia por rádio citando a lancha de Sílvia antes de ser interrompido.', source: 'Evidência E6', requiresEvidence: 'e6', crimeWindow: true },
                { time: '04h15', text: 'Cabo da lanterna é cortado; Eurico é empurrado da passarela superior.', source: 'Evidências E1 & E2', crimeWindow: true },
                { time: '04h21', text: 'Ernesto vê Sílvia de capa amarela descendo da torre com alicate rumo ao cais.', source: 'Evidência E7 (Oculta)', requiresEvidence: 'e7', crimeWindow: true },
                { time: '04h28', text: 'Radar registra a lancha de Sílvia deixando o cais rumo à Enseada Calma.', source: 'Evidência E5', requiresEvidence: 'e5', crimeWindow: true }
            ],
            keyConnections: [
                { from: 'suspect:silvia', to: 'evidence:e5', relation: 'contradiz', insight: 'A boia e o radar (04h02–04h28) provam que a lancha de Sílvia estava no Cais de Pedra!' },
                { from: 'suspect:silvia', to: 'evidence:e6', relation: 'motivo', insight: 'Eurico denunciou o desembarque clandestino de Sílvia no rádio segundos antes de morrer.' },
                { from: 'suspect:joao', to: 'evidence:e3', relation: 'confirma', insight: 'O plantão gravado na Capitania às 04h15 inocenta o Ten. João.' }
            ],
            hints: [
                'Nível 1: Use o horário exato do apagão da lanterna (0415) como PIN do Rádio Marítimo para ouvir o último aviso do Comandante (E6).',
                'Nível 2: Confronte Ernesto com E4 e compare o álibi náutico de Sílvia com a Telemetria da Boia e Radar (E5).',
                'Nível 3: Sílvia Maranhão atracou no cais às 04h02 (E5), cortou o gerador para encobrir o desembarque (E6) e empurrou Eurico da lanterna.'
            ],
            accusationOptions: {
                methods: [
                    { id: 'lantern_fall_sabotage', label: 'Corte intencional do gerador e empurrão da passarela superior da lanterna' },
                    { id: 'diesel_poison', label: 'Intoxicação por monóxido liberado do tanque de diesel do alojamento' },
                    { id: 'radio_shock', label: 'Descarga elétrica forjada diretamente no console do rádio marítimo' }
                ],
                alibiBreakers: [
                    { id: 'e5', label: 'E5 — Telemetria da Boia e Radar Costeiro (lancha atracada às 04h02–04h28)' },
                    { id: 'e4', label: 'E4 — Caderno de Desvio de Diesel de Ernesto' },
                    { id: 'e3', label: 'E3 — Livro de Plantão da Capitania dos Portos' }
                ]
            },
            solution: {
                culpritId: 'silvia',
                methodId: 'lantern_fall_sabotage',
                alibiBreakerId: 'e5',
                syndicateClue: 'Dossiê paralelo encerrado — rota clandestina marítima de Ponta Negra interceptada pela Capitania.',
                explanation:
                    'Eurico flagrou o desembarque clandestino coordenado pela lancha da engenheira Sílvia Maranhão e tentou avisar a Capitania pelo rádio às 04h14 (E6). Ten. João estava a 14 km na sede (E3) e Ernesto apenas furtava diesel no pátio externo (E4), vendo Sílvia descer de capa amarela com o alicate às 04h21 (E7). O radar costeiro e a boia acústica (E5) destruíram o álibi de Sílvia, provando que sua lancha ficou atracada no Cais de Pedra entre 04h02 e 04h28.',
                wrongEndings: {
                    ernesto: {
                        title: 'Furto de Diesel Punido, Lancha em Fuga',
                        text: 'Ernesto confessou os galões de diesel, mas suas pegadas não subiram à lanterna. Sílvia suspendeu âncora antes da maré alta e desapareceu em águas internacionais.'
                    },
                    joao: {
                        title: 'Capitania Invalida a Acusação',
                        text: 'As gravações contínuas de plantão a 14 km (E3) derrubaram o mandado contra o tenente em minutos.'
                    },
                    ines: {
                        title: 'Erro Doloroso Contra a Viúva',
                        text: 'A ligação de emergência às 04h17 a partir da linha fixa da casa anexa inocentou Inês completamente.'
                    },
                    _partial: {
                        title: 'Culpada Cercada, Falta Rigor no Mandado',
                        text: 'Sílvia é a responsável, mas você precisa apontar a sabotagem na lanterna e a telemetria costeira E5.'
                    },
                    _default: {
                        title: 'Inquérito Contestado na Costa',
                        text: 'Destrave o rádio com 0415 e cruze o horário com a boia costeira (E5).'
                    }
                }
            }
        }
    ];

    const MISTERY_CASE_TEMPLATE = {
        id: 'caso-custom-01',
        order: 99,
        act: 'Caso da Comunidade',
        isTutorial: false,
        unlockRequires: null,
        code: 'COMUNIDADE #01',
        title: 'Título do Seu Mistério',
        difficulty: 'Dificuldade: Moderada',
        victim: 'Nome da Vítima (idade, profissão)',
        location: 'Local principal do crime',
        timeOfDeath: 'Entre 22h00 e 22h30',
        crimeWindowLabel: 'JANELA CRÍTICA: 22h00 – 22h30',
        summary: 'Descreva o cenário inicial do caso para o jogador.',
        hotspots: [
            {
                id: 'spot1',
                x: 150, y: 120,
                label: 'Ponto Principal',
                detail: 'Ao inspecionar este ponto, você recolhe a evidência E2.',
                unlocksEvidences: ['e2']
            }
        ],
        floorplanSvg: '<svg class="floorplan-svg" viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="240" fill="#152028"/><rect x="40" y="30" width="360" height="180" fill="rgba(40,68,85,0.22)" stroke="#88b8d0" stroke-width="3"/><text x="220" y="125" text-anchor="middle" fill="#b7d8e8" font-family="monospace" font-size="11">PLANTA CUSTOMIZADA</text><g id="svg-hotspots"></g></svg>',
        suspects: [
            {
                id: 'susp1',
                name: 'Suspeito Culpado',
                age: 35,
                role: 'Sócio',
                profile: 'Calculista.',
                statement: 'Eu não entrei na sala às 22h15.',
                alibi: 'Diz que saiu antes das 22h00.',
                portrait: 'man_glasses',
                questions: [{ id: 'q1', q: 'Onde esteve?', a: 'Em casa.', mood: 'nervous' }],
                confrontations: [{ evidenceId: 'e2', response: 'Ele fica nervoso diante da prova!', unlocksEvidenceId: null, marksContradiction: true, mood: 'sweating' }],
                wrongConfront: 'Isso não prova nada.',
                wrongMood: 'calm'
            },
            {
                id: 'susp2',
                name: 'Suspeito Inocente',
                age: 29,
                role: 'Assistente',
                profile: 'Honesto.',
                statement: 'Estava no saguão.',
                alibi: 'Visto na portaria.',
                portrait: 'woman_bun',
                questions: [{ id: 'q1', q: 'Viu alguém?', a: 'Ouvi passos às 22h15.', mood: 'calm' }],
                confrontations: [],
                wrongConfront: 'Não sei nada sobre isso.',
                wrongMood: 'calm'
            }
        ],
        evidences: [
            { id: 'e1', code: 'E1', title: 'Laudo Inicial', type: 'forensic', initial: true, desc: 'Exame preliminar.', doc: 'Causa: Envenenamento às 22h15.' },
            { id: 'e2', code: 'E2', title: 'Registro de Acesso', type: 'log', initial: false, foundAtHotspot: 'spot1', desc: 'Log eletrônico da porta.', doc: 'Entrada de susp1 às 22h15.' }
        ],
        timeline: [
            { time: '22h15', text: 'Porta aberta pela credencial de susp1.', source: 'Evidência E2', requiresEvidence: 'e2', crimeWindow: true }
        ],
        keyConnections: [
            { from: 'suspect:susp1', to: 'evidence:e2', relation: 'contradiz', insight: 'Registro de acesso às 22h15 desmente susp1.' }
        ],
        hints: ['Nível 1: Colete E2 na planta.', 'Nível 2: Confronte susp1 com E2.', 'Nível 3: Acuse susp1 com E2.'],
        accusationOptions: {
            methods: [{ id: 'poison', label: 'Envenenamento' }],
            alibiBreakers: [{ id: 'e2', label: 'E2 — Registro de Acesso' }]
        },
        solution: {
            culpritId: 'susp1',
            methodId: 'poison',
            alibiBreakerId: 'e2',
            syndicateClue: 'Caso independente adicionado pela comunidade.',
            explanation: 'O registro eletrônico E2 provou que susp1 estava na sala às 22h15.',
            wrongEndings: {
                susp2: { title: 'Inocente Preso', text: 'Você prendeu o assistente errado.' },
                _default: { title: 'Inquérito Contestado', text: 'Revise as evidências do caso customizado.' }
            }
        }
    };

    function validateCustomCase(raw) {
        if (!raw || typeof raw !== 'object') return { ok: false, error: 'O JSON precisa ser um objeto de caso válido.' };
        const requiredStr = ['id', 'title', 'victim', 'location', 'timeOfDeath', 'summary'];
        for (const k of requiredStr) {
            if (!raw[k] || typeof raw[k] !== 'string') {
                return { ok: false, error: `Campo obrigatório ausente ou inválido: "${k}".` };
            }
        }
        if (!Array.isArray(raw.suspects) || raw.suspects.length < 2) {
            return { ok: false, error: 'O caso precisa ter pelo menos 2 suspeitos em "suspects".' };
        }
        if (!Array.isArray(raw.evidences) || raw.evidences.length < 2) {
            return { ok: false, error: 'O caso precisa ter pelo menos 2 evidências em "evidences".' };
        }
        if (!Array.isArray(raw.hotspots) || raw.hotspots.length < 1) {
            return { ok: false, error: 'O caso precisa ter pelo menos 1 ponto em "hotspots".' };
        }
        if (!raw.solution || !raw.solution.culpritId || !raw.solution.methodId || !raw.solution.alibiBreakerId) {
            return { ok: false, error: 'Objeto "solution" incompleto (culpritId, methodId, alibiBreakerId).' };
        }
        const suspectIds = new Set(raw.suspects.map(s => s.id));
        const evIds = new Set(raw.evidences.map(e => e.id));
        if (!suspectIds.has(raw.solution.culpritId)) {
            return { ok: false, error: 'solution.culpritId não corresponde a nenhum suspeito.' };
        }
        if (!evIds.has(raw.solution.alibiBreakerId)) {
            return { ok: false, error: 'solution.alibiBreakerId não corresponde a nenhuma evidência.' };
        }
        if (!raw.accusationOptions || !Array.isArray(raw.accusationOptions.methods) || !Array.isArray(raw.accusationOptions.alibiBreakers)) {
            return { ok: false, error: 'Campo "accusationOptions" inválido (informe arrays "methods" e "alibiBreakers").' };
        }
        const methodIds = new Set(raw.accusationOptions.methods.map(m => m && m.id));
        const alibiIds = new Set(raw.accusationOptions.alibiBreakers.map(a => a && a.id));
        if (!methodIds.has(raw.solution.methodId)) {
            return { ok: false, error: 'solution.methodId não consta em accusationOptions.methods.' };
        }
        if (!alibiIds.has(raw.solution.alibiBreakerId)) {
            return { ok: false, error: 'solution.alibiBreakerId não consta em accusationOptions.alibiBreakers.' };
        }
        // Garante que pelo menos uma evidência é visível inicialmente se nenhuma tiver initial:true
        const hasInitial = raw.evidences.some(e => e && e.initial === true);
        const cloned = JSON.parse(JSON.stringify(raw));
        cloned.suspects = cloned.suspects.map((s, idx) => ({
            id: (s && s.id) || `susp-${idx + 1}`,
            name: (s && s.name) || `Suspeito ${idx + 1}`,
            age: (s && s.age !== undefined) ? s.age : '—',
            role: (s && s.role) || 'Envolvido',
            profile: (s && s.profile) || 'Sem perfil complementar.',
            statement: (s && s.statement) || 'Sem depoimento registrado.',
            alibi: (s && s.alibi) || 'Álibi não informado.',
            portrait: (s && s.portrait) || 'man_glasses',
            questions: Array.isArray(s && s.questions) ? s.questions : [],
            confrontations: Array.isArray(s && s.confrontations) ? s.confrontations : [],
            wrongConfront: (s && s.wrongConfront) || 'Isso não contradiz o meu depoimento.',
            wrongMood: (s && s.wrongMood) || 'calm'
        }));
        cloned.evidences = cloned.evidences.map((ev, idx) => ({
            ...ev,
            id: (ev && ev.id) || `e${idx + 1}`,
            code: (ev && ev.code) || `E${idx + 1}`,
            title: (ev && ev.title) || `Evidência ${idx + 1}`,
            type: (ev && ev.type) || 'object',
            desc: (ev && ev.desc) || '',
            doc: (ev && ev.doc) || ''
        }));
        if (!hasInitial) cloned.evidences[0].initial = true;
        if (!cloned.floorplanSvg || typeof cloned.floorplanSvg !== 'string') {
            cloned.floorplanSvg = MISTERY_CASE_TEMPLATE.floorplanSvg;
        }
        if (!cloned.floorplanSvg.includes('svg-hotspots')) {
            cloned.floorplanSvg = cloned.floorplanSvg.replace(/<\/svg>/i, '<g id="svg-hotspots"></g></svg>');
        }
        if (!Array.isArray(cloned.timeline)) cloned.timeline = [];
        if (!Array.isArray(cloned.hints) || cloned.hints.length === 0) cloned.hints = ['Revise a cena do crime e os depoimentos.'];
        if (!Array.isArray(cloned.keyConnections)) cloned.keyConnections = [];
        cloned.isCustom = true;
        cloned.act = cloned.act || 'Caso da Comunidade';
        cloned.code = cloned.code || `CUSTOM • ${cloned.id.toUpperCase()}`;
        cloned.difficulty = cloned.difficulty || 'Comunidade';
        cloned.crimeWindowLabel = cloned.crimeWindowLabel || `JANELA: ${cloned.timeOfDeath}`;
        return { ok: true, caseObj: cloned };
    }

    global.MISTERY_CASES = MISTERY_CASES;
    global.CASES = MISTERY_CASES;
    global.MISTERY_ACHIEVEMENTS = MISTERY_ACHIEVEMENTS;
    global.MISTERY_RANKS = MISTERY_RANKS;
    global.MISTERY_CASE_TEMPLATE = MISTERY_CASE_TEMPLATE;
    global.validateCustomCase = validateCustomCase;
})(window);
