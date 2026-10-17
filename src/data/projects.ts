import { ProjectCardInfo } from '../types';

export const projects: ProjectCardInfo[] = [
  {
    id: 'couple-quiz',
    slug: '/que-tanto-nos-conocemos',
    title: {
      es: '¿Qué Tanto Nos Conocemos?',
      en: 'How Well Do We Know Each Other?',
    },
    description: {
      es: 'El juego de sintonía para parejas. Respondan por turnos en secreto quién es el dueño de cada hábito y descubran su compatibilidad con la gran revelación interactiva.',
      en: 'The couple quiz game. Answer who does what in secret and reveal your compatibility score.',
    },
    status: 'Live',
    category: {
      es: 'Juegos & Risas',
      en: 'Games & Fun',
    },
    actionLabel: {
      es: 'Jugar ahora',
      en: 'Play now',
    },
    tags: [
      { es: 'Duelo secreto', en: 'Secret duel' },
      { es: 'Pasa el móvil', en: 'Pass & play' },
      { es: 'Rejugable', en: 'Replayable' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-pink-500/15 via-rose-500/10 to-amber-500/5',
    featured: true,
  },
  {
    id: 'riddle-duel',
    slug: '/duelo-de-acertijos',
    title: {
      es: 'Duelo de Acertijos & Enigmas',
      en: 'Riddle & Enigma Duel',
    },
    description: {
      es: 'El que adivine gana. Desafíos de lógica, pensamiento lateral y el clásico Enigma de la Biblioteca con pistas progresivas y prendas en juego.',
      en: 'Whoever guesses wins. Logic, lateral thinking and the classic Library Enigma with progressive hints and romantic bets.',
    },
    status: 'Live',
    category: {
      es: 'Juegos & Risas',
      en: 'Games & Fun',
    },
    actionLabel: {
      es: 'Aceptar reto',
      en: 'Accept challenge',
    },
    tags: [
      { es: 'El que adivina gana', en: 'Guess to win' },
      { es: 'Pistas progresivas', en: 'Progressive hints' },
      { es: 'Prendas & apuestas', en: 'Bets & dares' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-amber-500/15 via-orange-500/10 to-rose-500/5',
    featured: true,
  },
  {
    id: 'would-you-rather',
    slug: '/esto-o-aquello',
    title: {
      es: 'Esto o Aquello: Nuestra Sintonía',
      en: 'Would You Rather: Couple Telepathy',
    },
    description: {
      es: 'Dilemas para parejas donde no solo eliges tu opción favorita, sino que intentas adivinar qué elegirá el otro para medir su nivel de lectura mental.',
      en: 'Couple dilemmas where you choose your favorite option and predict what your partner will choose to test telepathy.',
    },
    status: 'Live',
    category: {
      es: 'Juegos & Risas',
      en: 'Games & Fun',
    },
    actionLabel: {
      es: 'Ver dilemas',
      en: 'See dilemmas',
    },
    tags: [
      { es: 'Lectura de mente', en: 'Mind reading' },
      { es: 'Dilemas en pareja', en: 'Couple dilemmas' },
      { es: 'Rejugable', en: 'Replayable' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-purple-500/15 via-pink-500/10 to-rose-500/5',
    featured: true,
  },
  {
    id: 'if-i-were',
    slug: '/yo-si-fuera',
    title: {
      es: 'Yo Si Fuera... (El Espejo de Metáforas)',
      en: 'If I Were... (Metaphor Mirror)',
    },
    description: {
      es: '¿Si tu pareja fuera un animal, un lugar o una bebida... cuál sería y por qué? Escriban en secreto y creen su collage poético con estética de recortes.',
      en: 'If your partner were an animal, place or drink... what would they be? Write in secret and create your collage.',
    },
    status: 'Live',
    category: {
      es: 'Juegos & Risas',
      en: 'Games & Fun',
    },
    actionLabel: {
      es: 'Crear collage',
      en: 'Create collage',
    },
    tags: [
      { es: 'Estilo recortes', en: 'Collage style' },
      { es: 'Metáforas poéticas', en: 'Poetic metaphors' },
      { es: 'Tarjeta recuerdo', en: 'Keepsake card' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-emerald-500/15 via-teal-500/10 to-amber-500/5',
    featured: true,
  },
  {
    id: 'coloring-canvas',
    slug: '/arte-y-calma',
    title: {
      es: 'Lienzo para Colorear Juntos',
      en: 'Lienzo para Colorear Juntos',
    },
    description: {
      es: 'Un espacio sereno para desconectar y pintar juntos. Ilustraciones botánicas, mandalas y retratos para llenar de color con acuarelas y bote de pintura en tiempo real.',
      en: 'A serene space to unwind and paint together. Botanical art, mandalas, and couple portraits filled with soothing watercolors in real-time.',
    },
    status: 'Live',
    category: {
      es: 'Arte & Calma',
      en: 'Arte & Calma',
    },
    actionLabel: {
      es: 'Comenzar a pintar',
      en: 'Comenzar a pintar',
    },
    tags: [
      { es: 'Pintar juntos', en: 'Pintar juntos' },
      { es: 'Colección de láminas', en: 'Colección de láminas' },
      { es: 'Acuarelas', en: 'Acuarelas' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    featured: true,
  },
  {
    id: 'date-night-playbook',
    slug: '/cenas-y-veladas',
    title: {
      es: 'Nuestras Cenas & Veladas',
      en: 'Nuestras Cenas & Veladas',
    },
    description: {
      es: 'Un recetario íntimo diseñado para cocinar a cuatro manos. Platos deliciosos para preparar despacio, con velas encendidas, copas de vino y música suave.',
      en: 'An intimate recipe collection designed to cook together. Delicious dishes to prepare slowly with candles, wine, and ambient music.',
    },
    status: 'In Progress',
    category: {
      es: 'Cocina & Veladas',
      en: 'Cocina & Veladas',
    },
    actionLabel: {
      es: 'Ver recetario',
      en: 'Ver recetario',
    },
    isDemo: true,
    tags: [
      { es: 'Cocina para dos', en: 'Cocina para dos' },
      { es: 'A la luz de velas', en: 'A la luz de velas' },
      { es: 'Maridajes & vino', en: 'Maridajes & vino' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-rose-500/10 via-amber-500/5 to-transparent',
  },
];
