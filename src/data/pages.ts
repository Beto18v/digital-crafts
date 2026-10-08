export interface ColoringPage {
  id: string;
  title: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  category: string;
  imagePath: string;
  renderLineArt?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const coloringPages: ColoringPage[] = [
  // --- Categoría: Nosotros (public/us) ---
  {
    id: 'us-illustration',
    title: {
      es: 'Nosotros — Ilustración de Pareja',
      en: 'Us — Couple Line Art',
    },
    subtitle: {
      es: 'Trazos suaves y continuos listos para colorear a dos manos',
      en: 'Gentle, continuous strokes ready to color together',
    },
    category: 'Nosotros',
    imagePath: '/us/Couple_line_art_illustration_20261007181241.jpg',
  },
  {
    id: 'us-outdoors',
    title: {
      es: 'Nosotros — Paseo al Aire Libre',
      en: 'Us — Outdoor Stroll',
    },
    subtitle: {
      es: 'Cómplices en cada rincón y aventura compartida',
      en: 'Partners in every moment and shared adventure',
    },
    category: 'Nosotros',
    imagePath: '/us/Couple_posing_outdoors_20261007181050.jpg',
  },
  {
    id: 'us-01',
    title: {
      es: 'Nosotros — Silueta en el Espejo',
      en: 'Us — Mirror Silhouette',
    },
    subtitle: {
      es: 'Un instante espontáneo capturado en líneas limpias y elegantes',
      en: 'A spontaneous memory captured in clean, elegant lines',
    },
    category: 'Nosotros',
    imagePath: '/us/1.jpg',
  },
  {
    id: 'us-02',
    title: {
      es: 'Nosotros — Retrato y Conexión',
      en: 'Us — Portrait & Connection',
    },
    subtitle: {
      es: 'Cómplices en cada mirada y en cada nuevo camino juntos',
      en: 'Partners in every glance and on every path together',
    },
    category: 'Nosotros',
    imagePath: '/us/2.jpg',
  },
  {
    id: 'us-03',
    title: {
      es: 'Nosotros — Abrazo Infinito',
      en: 'Us — Endless Embrace',
    },
    subtitle: {
      es: 'Trazos minimalistas listos para llenar de color',
      en: 'Minimalist strokes ready to be filled with color',
    },
    category: 'Nosotros',
    imagePath: '/us/3.jpg',
  },

  // --- Categoría: Romántico (public/romantic) ---
  {
    id: 'romantic-cooking',
    title: {
      es: 'Romance — Cocinando Juntos',
      en: 'Romance — Cooking Together',
    },
    subtitle: {
      es: 'Preparar la cena a cuatro manos con risas y buena música',
      en: 'Cooking dinner side by side with shared laughter and wine',
    },
    category: 'Romántico',
    imagePath: '/romantic/Couple_cooking_dinner_together_20261007180918.jpg',
  },
  {
    id: 'romantic-piano',
    title: {
      es: 'Romance — Melodía al Piano',
      en: 'Romance — Piano Melody',
    },
    subtitle: {
      es: 'Dos almas compartiendo notas y acordes en armonía',
      en: 'Two souls sharing notes and chords in harmony',
    },
    category: 'Romántico',
    imagePath: '/romantic/Couple_playing_grand_piano_20261007180914.jpg',
  },
  {
    id: 'romantic-dog-walk',
    title: {
      es: 'Romance — Paseo en el Parque',
      en: 'Romance — Walk in the Park',
    },
    subtitle: {
      es: 'Caminatas tranquilas acompañados de nuestra mascota favorita',
      en: 'Peaceful walks together alongside our furry friend',
    },
    category: 'Romántico',
    imagePath: '/romantic/Couple_walking_dog_in_park_20261007180928.jpg',
  },
  {
    id: 'romantic-gym',
    title: {
      es: 'Romance — Entrenamiento en Pareja',
      en: 'Romance — Workout Together',
    },
    subtitle: {
      es: 'Motivación mutua y energía compartida cada día',
      en: 'Mutual motivation and energy shared every day',
    },
    category: 'Romántico',
    imagePath: '/romantic/Couple_working_out_at_gym_20261007180910.jpg',
  },

  // --- Categoría: Mandalas & Calma (public/mandalas) ---
  {
    id: 'mandalas-pets',
    title: {
      es: 'Calma — Siesta de Perro y Gato',
      en: 'Calm — Sleeping Cat & Dog',
    },
    subtitle: {
      es: 'Ternura y paz absoluta en un descanso compartido',
      en: 'Tenderness and absolute peace in a shared nap',
    },
    category: 'Mandalas',
    imagePath: '/mandalas/Dog_and_cat_sleeping_together_20261007180923.jpg',
  },
  {
    id: 'mandalas-01',
    title: {
      es: 'Mandala — Flor de Armonía',
      en: 'Mandala — Blossom of Harmony',
    },
    subtitle: {
      es: 'Geometría circular meditativa para calmar la mente y relajarse',
      en: 'Meditative circular geometry to calm the mind and unwind',
    },
    category: 'Mandalas',
    imagePath: '/mandalas/1.jpg',
  },
  {
    id: 'mandalas-02',
    title: {
      es: 'Mandala — Vínculo Sagrado',
      en: 'Mandala — Sacred Bond',
    },
    subtitle: {
      es: 'Patrones simétricos concéntricos listos para explorar paletas libres',
      en: 'Symmetric concentric patterns ready for free palette exploration',
    },
    category: 'Mandalas',
    imagePath: '/mandalas/2.jpg',
  },
];
