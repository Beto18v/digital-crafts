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

// Mapa de metadatos personalizados y poéticos para imágenes conocidas
const customMetadata: Record<
  string,
  {
    title: { es: string; en: string };
    subtitle: { es: string; en: string };
    category?: string;
  }
> = {
  // Nosotros (public/us)
  '/us/1.jpg': {
    title: { es: 'Nosotros — Retrato en Pareja 1', en: 'Us — Couple Portrait 1' },
    subtitle: { es: 'Recuerdo especial en trazos lineales para pintar juntos', en: 'Special memory in line art to color together' },
    category: 'Nosotros',
  },
  '/us/2.jpg': {
    title: { es: 'Nosotros — Momento 2', en: 'Us — Moment 2' },
    subtitle: { es: 'Cómplices en cada aventura y rincón del camino', en: 'Partners in every adventure along the way' },
    category: 'Nosotros',
  },
  '/us/3.jpg': {
    title: { es: 'Nosotros — Momento 3', en: 'Us — Moment 3' },
    subtitle: { es: 'Nuestra historia en un retrato minimalista', en: 'Our story captured in minimalist portrait lines' },
    category: 'Nosotros',
  },
  '/us/4.jpg': {
    title: { es: 'Nosotros — Abrazo Íntimo', en: 'Us — Warm Embrace' },
    subtitle: { es: 'Líneas suaves para revivir nuestro abrazo favorito', en: 'Soft lines capturing our warmest embrace' },
    category: 'Nosotros',
  },
  '/us/5.jpg': {
    title: { es: 'Nosotros — Tarde al Aire Libre', en: 'Us — Outdoors Together' },
    subtitle: { es: 'Un paseo al sol lleno de calma y naturaleza', en: 'A sunny walk full of calm and nature' },
    category: 'Nosotros',
  },
  '/us/6.jpg': {
    title: { es: 'Nosotros — Sonrisas Juntos', en: 'Us — Smiles Together' },
    subtitle: { es: 'La alegría de estar juntos dibujada con amor', en: 'The joy of being together drawn with love' },
    category: 'Nosotros',
  },
  '/us/7.jpg': {
    title: { es: 'Nosotros — Selfie en el Espejo', en: 'Us — Elevator Mirror Selfie' },
    subtitle: { es: 'Nuestro clásico recuerdo casual antes de salir', en: 'Our classic spontaneous mirror memory' },
    category: 'Nosotros',
  },
  '/us/8.jpeg': {
    title: { es: 'Nosotros — Atardecer Compartido', en: 'Us — Shared Sunset' },
    subtitle: { es: 'La calidez de compartir el fin del día a tu lado', en: 'The warmth of sharing the end of the day by your side' },
    category: 'Nosotros',
  },

  // Romántico (public/romantic)
  '/romantic/1.jpg': {
    title: { es: 'Romance — Cocinando Juntos', en: 'Romance — Cooking Together' },
    subtitle: { es: 'Compartiendo risas y aromas en la cocina', en: 'Sharing laughter and aromas in the kitchen' },
    category: 'Romántico',
  },
  '/romantic/2.jpg': {
    title: { es: 'Romance — Dueto al Piano', en: 'Romance — Grand Piano Duet' },
    subtitle: { es: 'Notas y melodías que cuentan nuestra historia', en: 'Notes and harmonies that play our melody' },
    category: 'Romántico',
  },
  '/romantic/3.jpg': {
    title: { es: 'Romance — Paseo en el Parque', en: 'Romance — Walk in the Park' },
    subtitle: { es: 'Atardeceres compartidos con nuestro compañero peludo', en: 'Sunsets shared with our furry best friend' },
    category: 'Romántico',
  },
  '/romantic/4.jpg': {
    title: { es: 'Romance — Entrenando en Pareja', en: 'Romance — Gym Partners' },
    subtitle: { es: 'Motivación mutua y complicidad en cada reto', en: 'Mutual motivation and energy in every challenge' },
    category: 'Romántico',
  },
  '/romantic/5.jpg': {
    title: { es: 'Romance — Corazón en Cintas', en: 'Romance — Ribbon Heart' },
    subtitle: { es: 'Geometría suave y simétrica en forma de corazón', en: 'Symmetrical delicate heart contours' },
    category: 'Romántico',
  },
  '/romantic/6.jpg': {
    title: { es: 'Romance — Manos Entrelazadas', en: 'Romance — Intertwined Hands' },
    subtitle: { es: 'Un pacto de caminar juntos paso a paso', en: 'A quiet promise to walk hand in hand' },
    category: 'Romántico',
  },

  // Mandalas (public/mandalas)
  '/mandalas/1.jpg': {
    title: { es: 'Mandala de la Armonía', en: 'Harmony Mandala' },
    subtitle: { es: 'Geometría meditativa para desconectar y pintar en calma', en: 'Meditative geometry to unwind and paint in peace' },
    category: 'Mandalas',
  },
  '/mandalas/2.jpg': {
    title: { es: 'Mandala del Vínculo', en: 'Bond Mandala' },
    subtitle: { es: 'Patrones simétricos y relajantes a cuatro manos', en: 'Symmetrical, relaxing patterns for two' },
    category: 'Mandalas',
  },
  '/mandalas/3.jpg': {
    title: { es: 'Mandala de la Paz y Ternura', en: 'Mandala of Peace & Sweetness' },
    subtitle: { es: 'Ternura y calma absoluta para colorear juntos', en: 'Peaceful rest and sweetness to color together' },
    category: 'Mandalas',
  },
};

/**
 * Convierte un nombre de archivo técnico a un título legible.
 * Ej: "Couple_walking_dog_in_park_20261007180928" -> "Couple Walking Dog In Park"
 */
function formatHumanTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  const withoutTimestamp = withoutExt.replace(/_\d{8,}(?=$|\b)/g, '');
  const cleaned = withoutTimestamp.replace(/[_\\-]+/g, ' ').trim();
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Determina la categoría según la carpeta en /public.
 */
function getCategoryFromFolder(folder: string): string {
  const normalized = folder.toLowerCase();
  if (normalized === 'us' || normalized === 'nosotros') return 'Nosotros';
  if (normalized === 'romantic' || normalized === 'romantico') return 'Romántico';
  if (normalized === 'mandalas' || normalized === 'mandala') return 'Mandalas';
  return folder.charAt(0).toUpperCase() + folder.slice(1);
}

/**
 * Escaneo dinámico mediante Vite import.meta.glob:
 * Descubre AUTOMÁTICAMENTE todos los archivos de imagen en /public/
 * Cada vez que agregues o elimines archivos en /public, Vite los toma al instante.
 */
const publicGlob = import.meta.glob(
  '/public/**/*.{jpg,jpeg,png,webp,svg,JPG,JPEG,PNG,WEBP}'
);

function buildPages(): ColoringPage[] {
  const keys = Object.keys(publicGlob);

  // Si por alguna razón de entorno el glob estuviera vacío, retornamos fallback
  if (keys.length === 0) {
    return Object.entries(customMetadata).map(([path, meta], idx) => ({
      id: `page-${idx + 1}`,
      title: meta.title,
      subtitle: meta.subtitle,
      category: meta.category || 'Nosotros',
      imagePath: path,
      thumbnail: path,
    }));
  }

  return keys.map((fullPath) => {
    // Convierte "/public/romantic/foto.jpg" a "/romantic/foto.jpg"
    const publicPath = fullPath.replace(/^\/public/, '');
    const parts = publicPath.split('/').filter(Boolean);
    const folder = parts.length > 1 ? parts[0] : 'general';
    const filename = parts[parts.length - 1] || 'image';

    const defaultCategory = getCategoryFromFolder(folder);
    const custom = customMetadata[publicPath];

    const humanTitle = formatHumanTitle(filename);
    const id = `${folder}-${filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

    return {
      id,
      title: custom?.title || {
        es: humanTitle,
        en: humanTitle,
      },
      subtitle: custom?.subtitle || {
        es: `Lámina de ${defaultCategory.toLowerCase()} lista para pintar juntos`,
        en: `${defaultCategory} coloring sheet ready to paint together`,
      },
      category: custom?.category || defaultCategory,
      imagePath: publicPath,
      thumbnail: publicPath,
    };
  }).sort((a, b) => {
    const priority: Record<string, number> = { Nosotros: 1, Romántico: 2, Mandalas: 3 };
    const pA = priority[a.category] || 99;
    const pB = priority[b.category] || 99;
    if (pA !== pB) return pA - pB;
    return a.id.localeCompare(b.id);
  });
}

export const coloringPages: ColoringPage[] = buildPages();
