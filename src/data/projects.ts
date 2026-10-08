import { ProjectCardInfo } from '../types';

export const projects: ProjectCardInfo[] = [
  {
    id: 'coloring-canvas',
    slug: '/coloring',
    title: {
      es: 'Interactive Coloring Canvas',
      en: 'Interactive Coloring Canvas',
    },
    description: {
      es: 'Lienzo digital colaborativo de ilustraciones botánicas y acuarelas para pintar en tiempo real desde dos pantallas sincronizadas con bote de pintura y paleta personalizada.',
      en: 'A collaborative digital canvas of botanical line art and watercolors to paint together in real-time across synced devices with flood fill and custom palettes.',
    },
    status: 'Live',
    category: {
      es: 'Arte & Calma',
      en: 'Art & Mindfulness',
    },
    actionLabel: {
      es: 'Abrir experiencia',
      en: 'Open experience',
    },
    tags: [
      { es: 'Bote de Pintura', en: 'Flood Fill' },
      { es: '10 Láminas', en: '10 Pages' },
      { es: 'Acuarelas', en: 'Watercolors' },
    ],
    layoutSpan: 'col-span-1 md:col-span-2 md:row-span-2',
    accentGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    featured: true,
  },
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
    status: 'In Progress',
    category: {
      es: 'Cocina & Veladas',
      en: 'Culinary & Evenings',
    },
    actionLabel: {
      es: 'Ver avance',
      en: 'Preview demo',
    },
    isDemo: true,
    tags: [
      { es: 'Cocina de Autor', en: 'Artisan Cooking' },
      { es: 'Recetas para Dos', en: 'Recipes for Two' },
      { es: 'Maridajes', en: 'Pairings' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-rose-500/10 via-amber-500/5 to-transparent',
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
    status: 'In Progress',
    category: {
      es: 'Juegos & Conexión',
      en: 'Play & Connection',
    },
    actionLabel: {
      es: 'Ver avance',
      en: 'Preview demo',
    },
    isDemo: true,
    tags: [
      { es: 'Preguntas Íntimas', en: 'Deep Prompts' },
      { es: 'Micro-Citas', en: 'Micro-Dates' },
    ],
    layoutSpan: 'col-span-1 md:col-span-1 md:row-span-1',
    accentGradient: 'from-purple-500/10 via-rose-500/5 to-transparent',
  },
];
