import { ProjectCardInfo } from '../types';

export const projects: ProjectCardInfo[] = [
  {
    id: 'date-night-playbook',
    slug: '/playbook',
    title: {
      es: 'The Date Night Playbook',
      en: 'The Date Night Playbook',
    },
    description: {
      es: 'Un recetario culinario íntimo y planificador de veladas a cuatro manos. Diseñado para cocinar juntos con velas, vino y listas de reproducción maridadas.',
      en: 'An intimate culinary companion and date planner for two. Designed to cook together with candlelight, wine pairings, and ambient soundtracks.',
    },
    status: 'Live',
    category: {
      es: 'Cocina & Veladas',
      en: 'Culinary & Evenings',
    },
    tags: [
      { es: 'Cocina de Autor', en: 'Artisan Cooking' },
      { es: 'Recetas para Dos', en: 'Recipes for Two' },
      { es: 'Maridajes', en: 'Pairings' },
    ],
    layoutSpan: 'col-span-1 md:col-span-2 md:row-span-2',
    accentGradient: 'from-rose-500/10 via-amber-500/5 to-transparent',
    featured: true,
  },
  {
    id: 'coloring-canvas',
    slug: '/coloring',
    title: {
      es: 'Interactive Coloring Canvas',
      en: 'Interactive Coloring Canvas',
    },
    description: {
      es: 'Lienzo digital colaborativo de ilustraciones botánicas y acuarelas para pintar en tiempo real desde dos pantallas sincronizadas.',
      en: 'A collaborative digital canvas of botanical line art and watercolors to paint together in real-time across synced devices.',
    },
    status: 'Live',
    category: {
      es: 'Arte & Calma',
      en: 'Art & Mindfulness',
    },
    tags: [
      { es: 'Bote de Pintura', en: 'Flood Fill' },
      { es: '10 Láminas', en: '10 Pages' },
      { es: 'Acuarelas', en: 'Watercolors' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
  },
  {
    id: 'adventure-jar',
    slug: '/adventure-jar',
    title: {
      es: 'The 52 Adventures Jar',
      en: 'The 52 Adventures Jar',
    },
    description: {
      es: 'Un frasco interactivo con tarjetas de preguntas profundas y micro-citas espontáneas para romper la rutina cada semana.',
      en: 'An interactive jar of heartfelt conversational prompts and spontaneous micro-dates to break routine every week.',
    },
    status: 'Live',
    category: {
      es: 'Juegos & Conexión',
      en: 'Play & Connection',
    },
    tags: [
      { es: 'Preguntas Íntimas', en: 'Deep Prompts' },
      { es: 'Micro-Citas', en: 'Micro-Dates' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-purple-500/10 via-rose-500/5 to-transparent',
  },
  {
    id: 'memory-capsule',
    slug: '/capsule',
    title: {
      es: 'Our Memory Capsule & Jukebox',
      en: 'Our Memory Capsule & Jukebox',
    },
    description: {
      es: 'Baúl digital de polaroids, cartas de audio y una gramola retro que atesora las canciones de nuestros viajes y aniversarios.',
      en: 'A digital keepsake vault of polaroid scans, audio letters, and a vintage jukebox scoring our travels and anniversaries.',
    },
    status: 'In Progress',
    category: {
      es: 'Memorias & Música',
      en: 'Memories & Audio',
    },
    tags: [
      { es: 'Polaroids', en: 'Polaroids' },
      { es: 'Notas de Voz', en: 'Voice Notes' },
      { es: 'Banda Sonora', en: 'Soundtrack' },
    ],
    layoutSpan: 'col-span-1 md:col-span-2 md:row-span-1',
    accentGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  {
    id: 'milestone-stargazer',
    slug: '/stargazer',
    title: {
      es: 'The Milestone Stargazer',
      en: 'The Milestone Stargazer',
    },
    description: {
      es: 'Mapa estelar interactivo que reconstruye el cielo nocturno y las constelaciones exactas en las fechas de nuestros hitos.',
      en: 'An interactive celestial map rendering the exact night sky and constellations on our relationship milestones.',
    },
    status: 'Coming Soon',
    category: {
      es: 'Astronomía & Fechas',
      en: 'Astronomy & Dates',
    },
    tags: [
      { es: 'Cielo Nocturno', en: 'Night Sky' },
      { es: 'Hitos', en: 'Milestones' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
  },
];
