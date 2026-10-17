export interface MetaphorCategory {
  id: string;
  name: string;
  emoji: string;
  prompt: string;
  suggestions: string[];
}

export const BASE_METAPHOR_CATEGORIES: MetaphorCategory[] = [
  {
    id: 'animal',
    name: 'Animal',
    emoji: '🦊',
    prompt: 'Si tu pareja fuera un animal, ¿cuál sería y por qué?',
    suggestions: ['Un gato mimoso y curioso', 'Un perro pug fiel y cariñoso', 'Un colibrí libre y lleno de energía', 'Un oso protector y dormilón', 'Un delfín juguetón'],
  },
  {
    id: 'lugar',
    name: 'Lugar en el Mundo',
    emoji: '🏝️',
    prompt: 'Si tu pareja fuera un lugar, ¿cuál sería y qué vibra transmite?',
    suggestions: ['Una cabaña con chimenea en la montaña', 'Una cala secreta con mar turquesa', 'Una cafetería bohemia un día de lluvia', 'Una terraza con vistas al atardecer de Florencia', 'Un bosque encantado de pinos'],
  },
  {
    id: 'planta',
    name: 'Planta o Flor',
    emoji: '🌿',
    prompt: 'Si tu pareja fuera una planta o flor, ¿cuál sería?',
    suggestions: ['Un girasol que siempre busca la luz', 'Un jazmín de aroma dulce que calma', 'Una orquídea elegante y única', 'Un cactus resistente y tierno por dentro', 'Un helecho exuberante'],
  },
  {
    id: 'personaje',
    name: 'Personaje Ficticio',
    emoji: '🎭',
    prompt: 'Si tu pareja fuera un personaje de película o libro, ¿quién sería?',
    suggestions: ['Un personaje inteligente y astuto', 'El alma aventurera del grupo', 'Alguien tierno con gran corazón', 'Un mago o hechicero misterioso', 'El héroe que siempre salva el día'],
  },
  {
    id: 'estacion',
    name: 'Estación del Año',
    emoji: '🍂',
    prompt: 'Si tu pareja fuera una estación del año o un clima, ¿cuál sería?',
    suggestions: ['Primavera: florecer y energía renovada', 'Otoño: calidez, bufandas y hojas doradas', 'Verano: días largos, sol y risas', 'Invierno: abrazos bajo la manta y chocolate caliente'],
  },
  {
    id: 'hobby',
    name: 'Hobby o Actividad',
    emoji: '🎨',
    prompt: 'Si tu pareja fuera un pasatiempo, ¿cuál representaría su esencia?',
    suggestions: ['Pintar acuarelas en silencio', 'Cocinar despacio a cuatro manos', 'Viajar sin mapa descubriendo rincones', 'Bailar sin vergüenza en el salón', 'Leer junto a una ventana soleada'],
  },
  {
    id: 'color',
    name: 'Color o Tono',
    emoji: '🎨',
    prompt: 'Si tu pareja fuera un color, ¿qué tono tendría?',
    suggestions: ['Rosa empolvado cálido', 'Azul zafiro profundo y calmado', 'Dorado sol del atardecer', 'Verde bosque relajante', 'Borgoña intenso y elegante'],
  },
  {
    id: 'bebida',
    name: 'Bebida',
    emoji: '☕',
    prompt: 'Si tu pareja fuera una bebida, ¿cómo sabría?',
    suggestions: ['Café con leche y canela en mañana fría', 'Copa de vino tinto suave y con cuerpo', 'Té chai con especias aromáticas', 'Limonada fresca con menta y hielo', 'Chocolate caliente espeso con nata'],
  },
  {
    id: 'comida',
    name: 'Comida o Postre',
    emoji: '🥐',
    prompt: 'Si tu pareja fuera un plato o comida, ¿cuál sería?',
    suggestions: ['Pasta fresca casera reconfortante', 'Tiramisú esponjoso con cacao puro', 'Croissant recién horneado con mantequilla', 'Pizza artesanal crujiente', 'Frutos rojos frescos con miel'],
  },
  {
    id: 'cancion',
    name: 'Canción o Género Musical',
    emoji: '🎶',
    prompt: 'Si tu pareja fuera una melodía, ¿qué canción o ritmo sería?',
    suggestions: ['Bossa nova suave y relajante', 'Balada acústica a guitarra', 'Jazz íntimo a la luz de las velas', 'Pop alegre que te hace bailar', 'Melodía de piano nostálgica'],
  },
  {
    id: 'superpoder',
    name: 'Superpoder',
    emoji: '✨',
    prompt: 'Si tu pareja fuera un superpoder mágico, ¿cuál sería?',
    suggestions: ['Hacer sonreír a cualquiera en segundos', 'Calmar la ansiedad con un abrazo', 'Adivinar lo que el otro necesita sin hablar', 'Teletransportarse a lugares mágicos', 'Detener el tiempo en los mejores momentos'],
  },
];
