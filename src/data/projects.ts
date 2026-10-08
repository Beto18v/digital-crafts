import { ProjectCardInfo } from '../types';

export const projects: ProjectCardInfo[] = [
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
    layoutSpan: 'col-span-1 md:col-span-2 md:row-span-2',
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
      es: 'Ver avance',
      en: 'Ver avance',
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
  {
    id: 'adventure-jar',
    slug: '/frasco-de-momentos',
    title: {
      es: 'Frasco de Momentos & Conversaciones',
      en: 'Frasco de Momentos & Conversaciones',
    },
    description: {
      es: 'Un rincón con preguntas profundas, recuerdos que nos unen y pequeñas citas espontáneas para detener el reloj y reconectar siempre que queramos.',
      en: 'A warm space with heartfelt prompts, shared memories, and spontaneous little date ideas to pause time and reconnect anytime.',
    },
    status: 'In Progress',
    category: {
      es: 'Juegos & Conexión',
      en: 'Juegos & Conexión',
    },
    actionLabel: {
      es: 'Ver avance',
      en: 'Ver avance',
    },
    isDemo: true,
    tags: [
      { es: 'Preguntas íntimas', en: 'Preguntas íntimas' },
      { es: 'Citas sorpresa', en: 'Citas sorpresa' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-purple-500/10 via-rose-500/5 to-transparent',
  },
];
