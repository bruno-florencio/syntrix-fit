export type MuscleGroup = 'Peito' | 'Costas' | 'Pernas' | 'Glúteos' | 'Ombros' | 'Bíceps' | 'Tríceps' | 'Panturrilhas' | 'Antebraço' | 'Core';
export type ExerciseLevel = 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado' | 'Expert';
export type Environment = 'Academia' | 'Casa';

export interface ExerciseDef {
  id: string;
  name: string;
  muscle: MuscleGroup;
  cues: string[];
  level: ExerciseLevel;
  environment: Environment;
  instructions: string[];
  freeDbId?: string; 
}

export interface WorkoutTemplateDef {
  id: string;
  title: string;
  description: string;
  daysCount: number;
  maxExercisesPerDay: number;
  allowedLevels: ExerciseLevel[];
  exercises: any[]; 
}

import allExercisesRaw from './allExercises.json';
const ALL_EXERCISES = allExercisesRaw as ExerciseDef[];

const CUSTOM_EXERCISES: ExerciseDef[] = [
  // ================= PEITORAL (ACADEMIA) =================
  { 
    id: 'chest_ac_bas_1', name: 'Supino Máquina Convergente', muscle: 'Peito', cues: ['Foco na contração do peitoral'], level: 'Básico', environment: 'Academia',
    instructions: ['Ajuste o banco para que os pegadores fiquem na linha do meio do peitoral.', 'Empurre o peso estendendo os cotovelos sem travar a articulação no final.', 'Retorne controladamente sentindo o alongamento do peitoral.'], freeDbId: 'Machine_Bench_Press'
  },
  { 
    id: 'chest_ac_bas_2', name: 'Supino Reto Barra Guiada (Smith)', muscle: 'Peito', cues: ['Escápulas retraídas'], level: 'Básico', environment: 'Academia',
    instructions: ['Deite no banco e posicione a barra na linha dos mamilos.', 'Desça a barra até tocar levemente o peito mantendo os cotovelos a 45 graus.', 'Empurre a barra de volta à posição inicial.'], freeDbId: 'Smith_Machine_Bench_Press'
  },
  { 
    id: 'chest_ac_bas_3', name: 'Supino Reto Halter Leve', muscle: 'Peito', cues: ['Controle o peso'], level: 'Básico', environment: 'Academia',
    instructions: ['Com os halteres na mão, deite-se de costas e levante os pesos acima do peito.', 'Desça os halteres de forma controlada até a altura do peito, alongando o músculo.', 'Empurre os halteres para cima fechando o arco levemente.'], freeDbId: 'Dumbbell_Bench_Press'
  },
  { 
    id: 'chest_ac_bas_4', name: 'Crucifixo Máquina', muscle: 'Peito', cues: ['Não force o ombro'], level: 'Básico', environment: 'Academia',
    instructions: ['Sente-se com as costas firmes no banco e segure os puxadores com os braços levemente flexionados.', 'Traga os braços para frente em um movimento de abraço focando no meio do peito.', 'Abra os braços lentamente controlando a volta do peso.'], freeDbId: 'Butterfly'
  },
  { 
    id: 'chest_ac_int_1', name: 'Supino Reto Barra', muscle: 'Peito', cues: ['Leg drive ativo e glúteos contraídos'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Deite-se no banco, segurando a barra com uma pegada um pouco mais larga que a largura dos ombros.', 'Desça a barra controladamente até o peito.', 'Pressione a barra com força para a posição de bloqueio inicial.'], freeDbId: 'Barbell_Bench_Press'
  },
  { 
    id: 'chest_ac_int_2', name: 'Supino Inclinado Barra', muscle: 'Peito', cues: ['Foco na porção superior do peitoral'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Sente-se em um banco inclinado (30 a 45 graus).', 'Retire a barra do rack e desça até a parte superior do peito.', 'Empurre a barra verticalmente até estender os cotovelos.'], freeDbId: 'Barbell_Incline_Bench_Press'
  },
  { 
    id: 'chest_ac_int_6', name: 'Crucifixo Inclinado', muscle: 'Peito', cues: ['Alongamento focado superior'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Sente em banco inclinado segurando halteres cima.', 'Abra os braços descendo os halteres em um amplo arco.', 'Contraia puxando-os de volta ao topo como se estivesse abraçando uma árvore.'], freeDbId: 'Incline_Dumbbell_Flyes'
  },
  { 
    id: 'chest_ac_int_7', name: 'Cross Over Médio', muscle: 'Peito', cues: ['Foco na tensão constante'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Posicione as polias na altura dos ombros ou ligeiramente acima.', 'Dê um passo à frente, incline o tronco levemente e mantenha os cotovelos um pouco flexionados.', 'Traga os puxadores à frente do corpo cruzando as mãos ou tocando-as.'], freeDbId: 'Cable_Crossover'
  },
  { 
    id: 'chest_ac_adv_2', name: 'Supino com Tempo Controlado (3-1-3)', muscle: 'Peito', cues: ['3s descendo, 1s pausa, 3s subindo'], level: 'Avançado', environment: 'Academia',
    instructions: ['Realize o movimento clássico do supino, mas conte 3 segundos de descida.', 'Faça uma pausa de 1 segundo mantendo a barra 1cm acima do peito, sem descansar no corpo.', 'Empurre de volta por 3 segundos de subida contínua.']
  },

  // ================= COSTAS (ACADEMIA) =================
  { 
    id: 'back_ac_bas_1', name: 'Puxada Frente Máquina (Pulldown)', muscle: 'Costas', cues: ['Costas contraídas e peitoral para cima'], level: 'Básico', environment: 'Academia',
    instructions: ['Sente-se na máquina com os joelhos travados no suporte.', 'Segure a barra larga e puxe em direção ao topo do peito.', 'Guie os cotovelos para baixo e contraia bem os dorsais.'], freeDbId: 'Wide-Grip_Lat_Pulldown'
  },
  { 
    id: 'back_ac_bas_3', name: 'Remada Baixa Máquina', muscle: 'Costas', cues: ['Sem balançar o corpo na execução inicial'], level: 'Básico', environment: 'Academia',
    instructions: ['Sente-se no aparelho e coloque os pés na plataforma mantendo os joelhos levemente flexionados.', 'Puxe o triângulo/barra em direção ao abdômen inferior.', 'Traga as escápulas juntas, pause, e solte lentamente.'], freeDbId: 'Seated_Cable_Rows'
  },
  { 
    id: 'back_ac_int_2', name: 'Remada Curvada Barra', muscle: 'Costas', cues: ['Sustentação na lombar, coluna alinhada'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Com os joelhos levemente dobrados, incline o tronco para a frente com a coluna reta.', 'Puxe a barra em direção ao umbigo, direcionando os cotovelos para o teto.', 'Desça a barra controladamente mantendo a postura firme.'], freeDbId: 'Bent_Over_Barbell_Row'
  },
  { 
    id: 'back_ac_int_3', name: 'Remada Halter Unilateral', muscle: 'Costas', cues: ['Puxe como se ligasse um motor de barco'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Apoie o joelho e a mão esquerda em um banco plano.', 'Puxe o halter com a mão direita trazendo o cotovelo para o alto nas costas.', 'Alongue totalmente ao descer e evite girar demais o tronco.'], freeDbId: 'One-Arm_Dumbbell_Row'
  },
  { 
    id: 'back_ac_adv_1', name: 'Barra Fixa Livre (Pullups)', muscle: 'Costas', cues: ['Tração vertical plena'], level: 'Avançado', environment: 'Academia',
    instructions: ['Dependure-se com uma pegada aberta e as palmas viradas para frente.', 'Puxe o corpo para cima levantando o peito de encontro à barra.', 'Desça de forma totalmente controlada até estender os braços.'], freeDbId: 'Pullups'
  },
  { 
    id: 'back_ac_adv_5', name: 'Deadlift Tradicional (Levantamento Terra)', muscle: 'Costas', cues: ['O Rei de todos os exercícios de cadeia posterior'], level: 'Avançado', environment: 'Academia',
    instructions: ['Hastes sobre o meio do pé, agache segurando a barra.', 'Suba levantando peito e quadril sincronizados mantendo as costas travadas.', 'Suba até a completa extensão dos quadris na vertical e retorne deslizando a barra pela perna.'], freeDbId: 'Barbell_Deadlift'
  },

  // ================= OMBRO (ACADEMIA) =================
  { 
    id: 'shd_ac_bas_1', name: 'Elevação Lateral Máquina', muscle: 'Ombros', cues: ['Girar o movimento no ombro e não no peso'], level: 'Básico', environment: 'Academia',
    instructions: ['Apoie os antebraços e sente com a coluna reta.', 'Eleve os cotovelos para os lados até alinharem com os ombros.', 'Desça suavemente até a posição neutra resistindo ao peso.'], freeDbId: 'Machine_Lateral_Raise'
  },
  { 
    id: 'shd_ac_int_1', name: 'Desenvolvimento Halter', muscle: 'Ombros', cues: ['Core rígido sem arquear em excesso a lombar'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Sente-se em um banco reta (ou 85 graus). Segure os halteres ao nível das orelhas.', 'Empurre os halteres para cima da cabeça até os braços se estenderem.', 'Desça controladamente até a posição lateral e repita.'], freeDbId: 'Dumbbell_Shoulder_Press'
  },
  { 
    id: 'shd_ac_int_2', name: 'Elevação Lateral Halter', muscle: 'Ombros', cues: ['Elevar focado no cotovelo imaginando derramar água'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Em pé, halteres aos lados do corpo.', 'Eleve os braços lateralmente mantendo leve flexão nos cotovelos.', 'No pico, incline um pouco as mãos pra baixo para intensificar no deltóide medial.'], freeDbId: 'Side_Lateral_Raise'
  },

  // ================= BÍCEPS (ACADEMIA) =================
  { 
    id: 'bic_ac_int_1', name: 'Rosca Direta Barra', muscle: 'Bíceps', cues: ['Controle lombar contra balanço do corpo'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Segure a barra com palmas voltadas para a frente e cotovelos fixados no tronco.', 'Flexione os cotovelos enrolando a barra em direção aos ombros.', 'Traga a barra de volta lentamente na descida e sinta a tensão.'], freeDbId: 'Barbell_Curl'
  },
  { 
    id: 'bic_ac_int_3', name: 'Rosca Martelo', muscle: 'Bíceps', cues: ['Foco em bíceps braquial e braquiorradial'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Com um halter em cada mão, posicione as mãos voltadas para você (pegada neutra).', 'Traga o halter alternadamente ou simultaneamente flexionando o braço.', 'Essa variação dará largura e espessura absurda aos braços.'], freeDbId: 'Hammer_Curls'
  },

  // ================= TRÍCEPS (ACADEMIA) =================
  { 
    id: 'tri_ac_bas_1', name: 'Tríceps Corda', muscle: 'Tríceps', cues: ['Evite empurrar com o ombro. Abra as cordas lá embaixo!'], level: 'Básico', environment: 'Academia',
    instructions: ['Em pé, levemente flexionado à frente, segure a corda na polia alta.', 'Estenda os braços empurrando as mãos para baixo.', 'No final (próximo à perna), separe um pouco as metades da corda p/ ativar a porção lateral.'], freeDbId: 'Triceps_Pushdown_-_Rope_Attachment'
  },
  { 
    id: 'tri_ac_int_1', name: 'Tríceps Testa', muscle: 'Tríceps', cues: ['Barra rente a testa, focando nos cotovelos apontando ao teto'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Deitado no banco de barriga para cima, segure a barra (W ou reta) acima da cabeça.', 'Flexione o cotovelo apontado pra cima, deixando a barra ir rumo à testa/cabeça.', 'Estique o tríceps estendendo os braços fortemente.'], freeDbId: 'Lying_Triceps_Press'
  },

  // ================= PERNAS COMPLETO (ACADEMIA) =================
  { 
    id: 'leg_ac_bas_1', name: 'Leg Press', muscle: 'Pernas', cues: ['Apoio limpo espinhando as placas do carrocheto sem empurrar com joelho'], level: 'Básico', environment: 'Academia',
    instructions: ['Posicione os pés mediamente no painel e desça a trava da máquina.', 'Abaixe as pernas em ângulo de 90° graus, sem deixar o quadril arredondar no apoio.', 'Empurre o calcanhar devolvendo o peso com maestria e não trave 100% no final.'], freeDbId: 'Leg_Press'
  },
  { 
    id: 'leg_ac_bas_2', name: 'Cadeira Extensora', muscle: 'Pernas', cues: ['Esmagar vastos na extensão total (pico de contração)'], level: 'Básico', environment: 'Academia',
    instructions: ['Sente-se na máquina com o encosto travando a base das costas.', 'Levante os pés esticando o mecanismo forçando enormemente a coxa frontal.', 'As pontas do pé deverão preferencialmente sempre apontar pro teto.'], freeDbId: 'Leg_Extensions'
  },
  { 
    id: 'leg_ac_bas_3', name: 'Mesa Flexora', muscle: 'Pernas', cues: ['Isolamento bruto do posterior de coxa e pouca lombar'], level: 'Básico', environment: 'Academia',
    instructions: ['Deite-se de barriga para baixo na máquina. O eixo deve estar alinhado aos seus joelhos.', 'Gire os tornozelos trazendo as almofadas na direção do glúteo.', 'Desça controlando com máxima resistência dolorosa!'], freeDbId: 'Lying_Leg_Curls'
  },
  { 
    id: 'leg_ac_int_1', name: 'Agachamento Livre (Barbell Squat)', muscle: 'Pernas', cues: ['Abdomen blindado, peso ancorado ao cálcanhar e base firme.'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Entre na barra travando-a sobre seus trapézios.', 'Tire a barra do rack, dê apenas dois passos distantes curtos. Inspire fundo.', 'Desça flexionando o quadril e em seguida joelho como quem busca apoiar num banco.', 'Suba acelerando na contração excêntrica para bater carga máxima.'], freeDbId: 'Barbell_Squat'
  },
  { 
    id: 'leg_ac_int_4', name: 'Hack Machine', muscle: 'Pernas', cues: ['Foco na estabilidade com suporte 100% nas costas'], level: 'Intermediário', environment: 'Academia',
    instructions: ['Posicione os pés à sua frente no Hack para isolamento profundo de quadríceps sem uso excessivo da hérnia/costas.', 'Deixe descer esticando todo o tendão no final e pule na subida atritando toda a extensão das pernas!'], freeDbId: 'Hack_Squat'
  },

  // ================= CORE (ACADEMIA) =================
  { 
    id: 'cor_ac_bas_1', name: 'Abdominal Simples (Crunch)', muscle: 'Core', cues: ['Crunch curto focando reto abdominal com expiração'], level: 'Básico', environment: 'Academia',
    instructions: ['Deite, joelhos flexionados, mãos no pescoço ou no peito levemente.', 'Tire ombros e omoplatas do chão apertando a musculatura central.', 'Retorne inspirando.'], freeDbId: 'Crunch_-_Hands_Overhead'
  },
  { 
    id: 'cor_ac_bas_2', name: 'Prancha', muscle: 'Core', cues: ['Corpo duro feito placa imitando travamento lombar da pedra'], level: 'Básico', environment: 'Academia',
    instructions: ['Deite e sustente todo o tronco via antebraços e bola do pé.', 'O corpo não pode declinar como um buraco. Trave o bumbum para auxiliar.', 'Segure a posição o máximo absoluto respirando de forma intercortada!']
  },

  // ================= CASA — BANCO ROBUSTO (CASA) =================
  { 
    id: 'cst_hm_int_1', name: 'Flexão Tradicional', muscle: 'Peito', cues: ['Core neutro. Posicione as mãos logo fora da espessura do peito.'], level: 'Intermediário', environment: 'Casa',
    instructions: ['Deite de barriga para baixo apostando mãos e pés em linha.', 'Mantenha abs contraído e omóplatas levemente apertadas em V.', 'Empurre o peso até cima do bloco. Tente manter simetria total bi-direcional.'], freeDbId: 'Pushups'
  },
  { 
    id: 'cst_hm_adv_3', name: 'Flexão Arqueiro', muscle: 'Peito', cues: ['Descer em eixo assimétrico para focar quase todo o peso num lado só da porção'], level: 'Avançado', environment: 'Casa',
    instructions: ['Posicione os braços 2x a largura dos ombros.', 'Desça flexionando apenas um braço enquanto estica o braço oposto paralelo à base.', 'Suba de volta empurrando o braço que flexionou. Tente não tombar para os lados!']
  },
  { 
    id: 'bak_hm_adv_1', name: 'Barra Fixa', muscle: 'Costas', cues: ['Sustentar em portal firme engajando peito saltado sempre.'], level: 'Avançado', environment: 'Casa',
    instructions: ['Pendure-se e rotacione brevemente o ombro para trás isolando a retração antes de começar subir.', 'Suba com violência limpa até ultrapassar os olhos pela linha da trava superior.', 'Retorne descendo com dignidade e técnica limpa!'], freeDbId: 'Pullups'
  },
  { 
    id: 'leg_hm_bas_1', name: 'Agachamento Próprio Peso (Air Squat)', muscle: 'Pernas', cues: ['Fazer devagar empurrando braços na altura do queixo'], level: 'Básico', environment: 'Casa',
    instructions: ['Inicie com as pernas voltadas ligeiramente de abertura lateral.', 'Abaixe com controle enviando os ísquios atrás.', 'Pressione sobre os pés erguendo em 1 tempo. Reze pra não cair nas laterais nas últimas séries!'], freeDbId: 'Bodyweight_Squat'
  },
  { 
    id: 'cor_hm_int_1', name: 'Hollow body / Canivete Isométrico', muscle: 'Core', cues: ['Posição de banana mantendo super retração de núcleo em solo'], level: 'Intermediário', environment: 'Casa',
    instructions: ['Deitado de barriga pra cima. Eleve braços esticados trás e pés na frente.', 'Não permita em hipótese nula sua lombar furar o chão com aberturas de mão. Empurre-a pra baixo!', 'Force e mantenha essa hipercompressão segurando toda extensão em queimação.']
  }
];

export const EXERCISE_DATABASE: ExerciseDef[] = [
  ...CUSTOM_EXERCISES,
  ...ALL_EXERCISES.filter(ex => !CUSTOM_EXERCISES.some(custom => custom.freeDbId === ex.freeDbId))
];

export const WORKOUT_TEMPLATES: WorkoutTemplateDef[] = [
  { id: 'beginner_fullbody', title: 'Iniciante: Full Body (3 dias/sem)', description: 'Foco em aprendizagem motora e estimulação sistêmica geral do corpo.', daysCount: 3, maxExercisesPerDay: 4, allowedLevels: ['Iniciante', 'Básico'], exercises: [] },
  { id: 'ab_classic', title: 'Básico: Treino AB (4 dias/sem)', description: 'Treino de adaptação dividindo o corpo em duas partes (Ex: Superior e Inferior).', daysCount: 4, maxExercisesPerDay: 5, allowedLevels: ['Iniciante', 'Básico', 'Intermediário'], exercises: [] },
  { id: 'abc_classic', title: 'Intermediário: Treino ABC (3 a 6 dias/sem)', description: 'O clássico: A-Peito/Tríceps, B-Costas/Bíceps, C-Perna/Ombro.', daysCount: 3, maxExercisesPerDay: 6, allowedLevels: ['Básico', 'Intermediário', 'Avançado'], exercises: [] },
  { id: 'abcd_split', title: 'Avançado: Treino ABCD (4 dias/sem)', description: 'Foco maior separando grandes blocos de músculos por dia para máximo volume.', daysCount: 4, maxExercisesPerDay: 7, allowedLevels: ['Intermediário', 'Avançado'], exercises: [] },
  { id: 'abcde_bro_split', title: 'Monstro: Treino ABCDE (5 dias/sem)', description: 'Divisão Extrema. Carga extrema em apenas um grupo muscular por dia.', daysCount: 5, maxExercisesPerDay: 10, allowedLevels: ['Intermediário', 'Avançado', 'Expert'], exercises: [] }
];
