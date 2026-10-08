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
  thumbnail: string;
  renderLineArt?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const coloringPages: ColoringPage[] = [
  // ==========================================
  // Categoría: Nosotros (public/us)
  // ==========================================
  {
    id: 'us-01',
    title: {
      es: 'Nosotros — Retrato en Pareja 1',
      en: 'Us — Couple Portrait 1',
    },
    subtitle: {
      es: 'Recuerdo especial en trazos lineales para pintar juntos',
      en: 'Special memory in line art to color together',
    },
    category: 'Nosotros',
    imagePath: '/us/1.jpg',
    thumbnail: '/us/1.jpg',
  },
  {
    id: 'us-02',
    title: {
      es: 'Nosotros — Momento 2',
      en: 'Us — Moment 2',
    },
    subtitle: {
      es: 'Cómplices en cada aventura y rincón del camino',
      en: 'Partners in every adventure along the way',
    },
    category: 'Nosotros',
    imagePath: '/us/2.jpg',
    thumbnail: '/us/2.jpg',
  },
  {
    id: 'us-03',
    title: {
      es: 'Nosotros — Momento 3',
      en: 'Us — Moment 3',
    },
    subtitle: {
      es: 'Nuestra historia en un retrato minimalista',
      en: 'Our story captured in minimalist portrait lines',
    },
    category: 'Nosotros',
    imagePath: '/us/3.jpg',
    thumbnail: '/us/3.jpg',
  },

  // ==========================================
  // Categoría: Romántico (public/romantic)
  // ==========================================
  {
    id: 'romantic-01',
    title: {
      es: 'Romance & Ternura 1',
      en: 'Romance & Tenderness 1',
    },
    subtitle: {
      es: 'Abrazo íntimo con suaves líneas para colorear',
      en: 'Intimate embrace with soft line art to color',
    },
    category: 'Romántico',
    imagePath: '/romantic/1.jpg',
    thumbnail: '/romantic/1.jpg',
  },
  {
    id: 'romantic-02',
    title: {
      es: 'Romance & Ternura 2',
      en: 'Romance & Tenderness 2',
    },
    subtitle: {
      es: 'Miradas compartidas y detalles llenos de cariño',
      en: 'Shared glances and details filled with love',
    },
    category: 'Romántico',
    imagePath: '/romantic/2.jpg',
    thumbnail: '/romantic/2.jpg',
  },
  {
    id: 'romantic-03',
    title: {
      es: 'Romance — Cocinando Juntos',
      en: 'Romance — Cooking Together',
    },
    subtitle: {
      es: 'Compartiendo risas y aromas en la cocina',
      en: 'Sharing laughter and warmth in the kitchen',
    },
    category: 'Romántico',
    imagePath: '/romantic/Couple_cooking_dinner_together_20261007180918.jpg',
    thumbnail: '/romantic/Couple_cooking_dinner_together_20261007180918.jpg',
  },
  {
    id: 'romantic-04',
    title: {
      es: 'Romance — Manos Entrelazadas',
      en: 'Romance — Intertwined Hands',
    },
    subtitle: {
      es: 'Un pacto de caminar juntos paso a paso',
      en: 'A quiet promise to walk hand in hand',
    },
    category: 'Romántico',
    imagePath: '/romantic/Two_hands_holding_each_other_20261007180928.jpg',
    thumbnail: '/romantic/Two_hands_holding_each_other_20261007180928.jpg',
  },
  {
    id: 'romantic-05',
    title: {
      es: 'Romance — Corazón en Cintas',
      en: 'Romance — Ribbon Heart',
    },
    subtitle: {
      es: 'Geometría suave y simétrica en forma de corazón',
      en: 'Symmetrical delicate heart contours',
    },
    category: 'Romántico',
    imagePath: '/romantic/Symmetrical_heart_formed_by_ribbons_20261007180930.jpg',
    thumbnail: '/romantic/Symmetrical_heart_formed_by_ribbons_20261007180930.jpg',
  },

  // ==========================================
  // Categoría: Mandalas (public/mandalas)
  // ==========================================
  {
    id: 'mandalas-01',
    title: {
      es: 'Mandala de la Armonía',
      en: 'Harmony Mandala',
    },
    subtitle: {
      es: 'Geometría meditativa para desconectar y pintar en calma',
      en: 'Meditative geometry to unwind and paint in peace',
    },
    category: 'Mandalas',
    imagePath: '/mandalas/1.jpg',
    thumbnail: '/mandalas/1.jpg',
  },
  {
    id: 'mandalas-02',
    title: {
      es: 'Mandala del Vínculo',
      en: 'Bond Mandala',
    },
    subtitle: {
      es: 'Patrones simétricos y relajantes a cuatro manos',
      en: 'Symmetrical, relaxing patterns for two',
    },
    category: 'Mandalas',
    imagePath: '/mandalas/2.jpg',
    thumbnail: '/mandalas/2.jpg',
  },
];
