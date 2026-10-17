export interface StickFigureCard {
  id: string;
  description: string;
  difficulty: 'easy' | 'medium';
  items: string[];
  emoji: string;
}

export const STICK_FIGURE_CARDS: StickFigureCard[] = [
  {
    id: 'sf-1',
    description: 'Tiene sombrero y lentes',
    difficulty: 'easy',
    items: ['sombrero', 'lentes'],
    emoji: '🎩🕶️',
  },
  {
    id: 'sf-2',
    description: 'Lleva botas y bufanda',
    difficulty: 'easy',
    items: ['botas', 'bufanda'],
    emoji: '🧣👢',
  },
  {
    id: 'sf-3',
    description: 'Tiene un globo y está contento',
    difficulty: 'easy',
    items: ['globo', 'sonrisa'],
    emoji: '🎈😊',
  },
  {
    id: 'sf-4',
    description: 'Tiene pelo corto y una gorra',
    difficulty: 'easy',
    items: ['pelo_corto', 'gorra'],
    emoji: '🧢',
  },
  {
    id: 'sf-5',
    description: 'Está feliz y tiene una flor',
    difficulty: 'easy',
    items: ['flor', 'sonrisa'],
    emoji: '🌸😃',
  },
  {
    id: 'sf-6',
    description: 'Tiene pelo rizado y ojos grandes',
    difficulty: 'medium',
    items: ['pelo_rizado', 'ojos_grandes'],
    emoji: '👩‍🦱👀',
  },
  {
    id: 'sf-7',
    description: 'Lleva vestido y tiene botas',
    difficulty: 'medium',
    items: ['vestido', 'botas'],
    emoji: '👗👢',
  },
  {
    id: 'sf-8',
    description: 'Tiene un regalo y está sorprendido',
    difficulty: 'medium',
    items: ['regalo', 'sorpresa'],
    emoji: '🎁😲',
  },
  {
    id: 'sf-9',
    description: 'Tiene una guitarra y está bailando',
    difficulty: 'medium',
    items: ['guitarra', 'baile'],
    emoji: '🎸💃',
  },
  {
    id: 'sf-10',
    description: 'Lleva zapatillas y reloj',
    difficulty: 'medium',
    items: ['zapatillas', 'reloj'],
    emoji: '👟⌚',
  },
  {
    id: 'sf-11',
    description: 'Lleva shorts y camiseta',
    difficulty: 'easy',
    items: ['shorts', 'camiseta'],
    emoji: '🩳👕',
  },
  {
    id: 'sf-12',
    description: 'Lleva gorra y tenis',
    difficulty: 'easy',
    items: ['gorra', 'tenis'],
    emoji: '🧢👟',
  },
  {
    id: 'sf-13',
    description: 'Tiene paraguas y está contento',
    difficulty: 'easy',
    items: ['paraguas', 'sonrisa'],
    emoji: '☂️😄',
  },
  {
    id: 'sf-14',
    description: 'Está triste y tiene una mochila',
    difficulty: 'medium',
    items: ['mochila', 'tristeza'],
    emoji: '🎒😢',
  },
  {
    id: 'sf-15',
    description: 'Tiene pelo rapado y un teléfono',
    difficulty: 'medium',
    items: ['pelo_rapado', 'telefono'],
    emoji: '📱🧑‍🦲',
  },
];
