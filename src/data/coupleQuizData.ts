export interface QuizQuestion {
  id: string;
  category: 'clasico' | 'romance' | 'convivencia' | 'picardia' | 'personalizado';
  text: string;
  emoji?: string;
  tag?: string;
}

export interface QuizPack {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export const QUIZ_PACKS: QuizPack[] = [
  {
    id: 'clasico',
    name: 'Edición Original (Lámina)',
    description: 'Las 12 preguntas esenciales del juego de ilustración clásico.',
    icon: '📜',
    questionCount: 12,
  },
  {
    id: 'romance',
    name: 'Romance & Primeras Veces',
    description: 'Primeras miradas, nervios del inicio, caricias y detalles.',
    icon: '💌',
    questionCount: 12,
  },
  {
    id: 'convivencia',
    name: 'Hogar & Convivencia',
    description: 'Hábitos diarios, sábanas robadas, películas y cocina.',
    icon: '🏡',
    questionCount: 12,
  },
  {
    id: 'picardia',
    name: 'Risas & Dilemas Divertidos',
    description: 'Preguntas con humor, celillos sanos y situaciones locas.',
    icon: '✨',
    questionCount: 12,
  },
  {
    id: 'mix',
    name: 'Ronda Express Aleatoria',
    description: '10 preguntas seleccionadas al azar de todos los paquetes.',
    icon: '🎲',
    questionCount: 10,
  },
];

export const BASE_QUESTIONS: QuizQuestion[] = [
  // Paquete Clásico (Las 12 preguntas exactas de la lámina original)
  { id: 'c1', category: 'clasico', text: '¿Quién dio el primer paso?', emoji: '👣', tag: 'Comienzos' },
  { id: 'c2', category: 'clasico', text: '¿Quién es más puntual?', emoji: '⏰', tag: 'Hábitos' },
  { id: 'c3', category: 'clasico', text: '¿Quién dijo "te amo" primero?', emoji: '💬', tag: 'Romance' },
  { id: 'c4', category: 'clasico', text: '¿Quién cocina mejor?', emoji: '🍳', tag: 'Cocina' },
  { id: 'c5', category: 'clasico', text: '¿Quién baila mejor?', emoji: '💃', tag: 'Talento' },
  { id: 'c6', category: 'clasico', text: '¿Quién juega más videojuegos en PC?', emoji: '🎮', tag: 'Hobbies' },
  { id: 'c7', category: 'clasico', text: '¿Quién canta mejor?', emoji: '🎤', tag: 'Música' },
  { id: 'c8', category: 'clasico', text: '¿Quién es más detallista?', emoji: '🎁', tag: 'Detalles' },
  { id: 'c9', category: 'clasico', text: '¿Quién es más ordenado?', emoji: '🧹', tag: 'Hogar' },
  { id: 'c10', category: 'clasico', text: '¿Quién cocina más seguido?', emoji: '👨‍🍳', tag: 'Cocina' },
  { id: 'c11', category: 'clasico', text: '¿Quién es más sociable?', emoji: '🗣️', tag: 'Amigos' },
  { id: 'c12', category: 'clasico', text: '¿Quién se enoja más rápido?', emoji: '😤', tag: 'Carácter' },

  // Paquete Romance & Primeras Veces
  { id: 'r1', category: 'romance', text: '¿Quién se enamoró primero?', emoji: '💘', tag: 'Amor' },
  { id: 'r2', category: 'romance', text: '¿Quién planea las citas más románticas?', emoji: '🕯️', tag: 'Citas' },
  { id: 'r3', category: 'romance', text: '¿Quién manda más mensajes durante el día?', emoji: '📱', tag: 'Conexión' },
  { id: 'r4', category: 'romance', text: '¿Quién es más cariñoso en público?', emoji: '🫂', tag: 'Cariño' },
  { id: 'r5', category: 'romance', text: '¿Quién se puso más nervioso en la primera cita?', emoji: '🫣', tag: 'Recuerdos' },
  { id: 'r6', category: 'romance', text: '¿Quién propone siempre abrazarse antes de dormir?', emoji: '🛌', tag: 'Noches' },
  { id: 'r7', category: 'romance', text: '¿Quién guarda más fotos del otro en el móvil?', emoji: '📸', tag: 'Fotos' },
  { id: 'r8', category: 'romance', text: '¿Quién da los mejores besos de sorpresa?', emoji: '💋', tag: 'Besos' },
  { id: 'r9', category: 'romance', text: '¿Quién es más sentimental con fechas especiales?', emoji: '📅', tag: 'Fechas' },
  { id: 'r10', category: 'romance', text: '¿Quién extraña más rápido cuando están separados?', emoji: '🥺', tag: 'Distancia' },
  { id: 'r11', category: 'romance', text: '¿Quién hace reír más al otro en días difíciles?', emoji: '☀️', tag: 'Apoyo' },
  { id: 'r12', category: 'romance', text: '¿Quién dijo "vamos a vivir juntos" o pensó en el futuro primero?', emoji: '🏠', tag: 'Futuro' },

  // Paquete Hogar & Convivencia
  { id: 'h1', category: 'convivencia', text: '¿Quién se roba más las sábanas en la madrugada?', emoji: '🥶', tag: 'Cama' },
  { id: 'h2', category: 'convivencia', text: '¿Quién tarda más tiempo en arreglarse para salir?', emoji: '💄', tag: 'Rutina' },
  { id: 'h3', category: 'convivencia', text: '¿Quién se queda dormido a los 10 minutos de empezar una película?', emoji: '🍿', tag: 'Cine' },
  { id: 'h4', category: 'convivencia', text: '¿Quién propone siempre pedir comida a domicilio?', emoji: '🍕', tag: 'Antojos' },
  { id: 'h5', category: 'convivencia', text: '¿Quién acumula más tazas o vasos en la mesa de noche?', emoji: '☕', tag: 'Manías' },
  { id: 'h6', category: 'convivencia', text: '¿Quién despierta de mejor humor por las mañanas?', emoji: '🌅', tag: 'Mañanas' },
  { id: 'h7', category: 'convivencia', text: '¿Quién es más friolento cuando baja la temperatura?', emoji: '🧣', tag: 'Clima' },
  { id: 'h8', category: 'convivencia', text: '¿Quién gasta más en compras impulsivas o antojitos?', emoji: '🛍️', tag: 'Compras' },
  { id: 'h9', category: 'convivencia', text: '¿Quién elige siempre la música en los viajes en coche?', emoji: '🎶', tag: 'Viajes' },
  { id: 'h10', category: 'convivencia', text: '¿Quién pierde más seguido las llaves o el teléfono?', emoji: '🔍', tag: 'Despistes' },
  { id: 'h11', category: 'convivencia', text: '¿Quién lava los platos sin que nadie se lo pida?', emoji: '🧼', tag: 'Limpieza' },
  { id: 'h12', category: 'convivencia', text: '¿Quién propone más planes improvisados de fin de semana?', emoji: '🎒', tag: 'Aventuras' },

  // Paquete Risas & Dilemas Divertidos
  { id: 'p1', category: 'picardia', text: '¿Quién sobreviviría más tiempo en un apocalipsis zombi?', emoji: '🧟', tag: 'Supervivencia' },
  { id: 'p2', category: 'picardia', text: '¿Quién es más terco cuando cree que tiene la razón?', emoji: '🧐', tag: 'Debates' },
  { id: 'p3', category: 'picardia', text: '¿Quién se asusta más fácil con ruidos en la oscuridad o pelis de terror?', emoji: '👻', tag: 'Miedos' },
  { id: 'p4', category: 'picardia', text: '¿Quién baila peor pero con más orgullo y alegría?', emoji: '🕺', tag: 'Risas' },
  { id: 'p5', category: 'picardia', text: '¿Quién es más propenso a hacer pucheros tiernos para conseguir algo?', emoji: '🥺', tag: 'Mimos' },
  { id: 'p6', category: 'picardia', text: '¿Quién se ríe en los momentos más inoportunos?', emoji: '🤭', tag: 'Risas' },
  { id: 'p7', category: 'picardia', text: '¿Quién llora con mayor facilidad viendo películas emotivas?', emoji: '🥹', tag: 'Emoción' },
  { id: 'p8', category: 'picardia', text: '¿Quién se come las cosas ricas que el otro guardó en la nevera?', emoji: '🍰', tag: 'Crimen' },
  { id: 'p9', category: 'picardia', text: '¿Quién canta a todo pulmón en la ducha?', emoji: '🚿', tag: 'Ducha' },
  { id: 'p10', category: 'picardia', text: '¿Quién es más celoso en secreto (aunque lo niegue)?', emoji: '👀', tag: 'Secretos' },
  { id: 'p11', category: 'picardia', text: '¿Quién se tarda más eligiendo qué comer cuando hay muchas opciones?', emoji: '🍽️', tag: 'Indecisión' },
  { id: 'p12', category: 'picardia', text: '¿Quién ama más al otro? (¡Cuidado con esta!)', emoji: '❤️‍🔥', tag: 'Duelo' },
];

export interface PlayerVote {
  questionId: string;
  selectedPlayer: 'p1' | 'p2' | 'both';
}

export function getRandomQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...BASE_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByPack(packId: string): QuizQuestion[] {
  if (packId === 'mix') {
    return getRandomQuestions(10);
  }
  return BASE_QUESTIONS.filter((q) => q.category === packId);
}
