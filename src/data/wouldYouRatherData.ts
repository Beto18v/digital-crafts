export interface WouldYouRatherDilemma {
  id: string;
  category: 'citas' | 'convivencia' | 'viajes' | 'dilemas' | 'comida';
  optionA: {
    text: string;
    emoji: string;
  };
  optionB: {
    text: string;
    emoji: string;
  };
}

export const WYR_CATEGORIES = [
  { id: 'todos', name: 'Todos los Dilemas', icon: '🎲', desc: 'Mezcla impredecible y divertida' },
  { id: 'citas', name: 'Citas & Romance', icon: '🕯️', desc: 'Planes a solas, sorpresas y veladas' },
  { id: 'viajes', name: 'Viajes & Aventuras', icon: '✈️', desc: 'Escapadas por el mundo y naturaleza' },
  { id: 'convivencia', name: 'Hogar & Día a Día', icon: '🏡', desc: 'Hábitos diarios, cama, series y sofá' },
  { id: 'comida', name: 'Comida & Antojos', icon: '🍕', desc: 'Platos deliciosos y placeres culinarios' },
  { id: 'dilemas', name: 'Fantasía & Dilemas Locos', icon: '🔮', desc: 'Superpoderes y situaciones hipotéticas' },
];

export const BASE_DILEMMAS: WouldYouRatherDilemma[] = [
  // Citas & Romance
  {
    id: 'c-1',
    category: 'citas',
    optionA: { text: 'Cabaña en la montaña con chimenea de leña y mantas', emoji: '🪵' },
    optionB: { text: 'Bungalow sobre el mar turquesa con atardecer tropical', emoji: '🏝️' },
  },
  {
    id: 'c-2',
    category: 'citas',
    optionA: { text: 'Cena elegante a la luz de las velas con vino y vestidos', emoji: '🍷' },
    optionB: { text: 'Picnic bajo las estrellas con música acústica en directo', emoji: '🧺' },
  },
  {
    id: 'c-3',
    category: 'citas',
    optionA: { text: 'Desayuno sorpresa en la cama con café recién hecho', emoji: '🥐' },
    optionB: { text: 'Masaje relajante con aceites aromáticos de 45 minutos', emoji: '💆' },
  },
  {
    id: 'c-4',
    category: 'citas',
    optionA: { text: 'Paseo nocturno bajo una lluvia suave abrazados', emoji: '🌧️' },
    optionB: { text: 'Mirar el amanecer juntos desde lo alto de una colina', emoji: '🌅' },
  },

  // Viajes & Aventuras
  {
    id: 'v-1',
    category: 'viajes',
    optionA: { text: 'Viajar en camper van recorriendo pueblos sin prisa', emoji: '🚐' },
    optionB: { text: 'Hotel boutique 5 estrellas en una ciudad histórica europea', emoji: '🏰' },
  },
  {
    id: 'v-2',
    category: 'viajes',
    optionA: { text: 'Perderse en las calles iluminadas de Tokio de noche', emoji: '🏮' },
    optionB: { text: 'Ver la aurora boreal desde un iglú de cristal en Islandia', emoji: '🌌' },
  },
  {
    id: 'v-3',
    category: 'viajes',
    optionA: { text: 'Viaje espontáneo de mochila sin reservar alojamiento', emoji: '🎒' },
    optionB: { text: 'Itinerario perfecto y organizado con cada restaurante reservado', emoji: '📋' },
  },

  // Hogar & Convivencia
  {
    id: 'h-1',
    category: 'convivencia',
    optionA: { text: 'Maratón de películas en pijama todo el domingo con pizza', emoji: '🍕' },
    optionB: { text: 'Salir a un café bonito, pasear y hacer compras juntos', emoji: '☕' },
  },
  {
    id: 'h-2',
    category: 'convivencia',
    optionA: { text: 'Un ático moderno con terraza y vistas panorámicas', emoji: '🏙️' },
    optionB: { text: 'Una casa de campo con jardín grande, árboles y perros', emoji: '🏡' },
  },
  {
    id: 'h-3',
    category: 'convivencia',
    optionA: { text: 'Que la comida se cocine sola por arte de magia', emoji: '🍲' },
    optionB: { text: 'Que la ropa y la casa se limpien solas automáticamente', emoji: '✨' },
  },
  {
    id: 'h-4',
    category: 'convivencia',
    optionA: { text: 'Dormir con aire acondicionado frío y mil mantas encima', emoji: '❄️' },
    optionB: { text: 'Dormir con ventana abierta escuchando el viento y los grillos', emoji: '🍃' },
  },

  // Comida & Antojos
  {
    id: 'f-1',
    category: 'comida',
    optionA: { text: 'Pizza artesanal con bordes de queso y cerveza fría', emoji: '🍕' },
    optionB: { text: 'Sushi fresco variado con tempura y salsa de soja', emoji: '🍣' },
  },
  {
    id: 'f-2',
    category: 'comida',
    optionA: { text: 'Comer postre y chocolates ilimitados sin engordar jamás', emoji: '🍫' },
    optionB: { text: 'Poder comer en el mejor restaurante del mundo una vez al mes gratis', emoji: '⭐' },
  },
  {
    id: 'f-3',
    category: 'comida',
    optionA: { text: 'Tener siempre café de especialidad perfecto al instante', emoji: '☕' },
    optionB: { text: 'Tener siempre el cóctel o copa de vino perfecta por la noche', emoji: '🍸' },
  },

  // Fantasía & Dilemas Locos
  {
    id: 'd-1',
    category: 'dilemas',
    optionA: { text: 'Poder teletransportarse a cualquier lugar con un chasquido', emoji: '⚡' },
    optionB: { text: 'Poder pausar el tiempo durante 1 hora cada día', emoji: '⏳' },
  },
  {
    id: 'd-2',
    category: 'dilemas',
    optionA: { text: 'Revivir el día en que nos conocimos con los mismos ojos', emoji: '🕰️' },
    optionB: { text: 'Dar un vistazo de 10 minutos a nuestras vidas dentro de 30 años', emoji: '🔮' },
  },
  {
    id: 'd-3',
    category: 'dilemas',
    optionA: { text: 'Poder hablar fluidamente con todos los animales del mundo', emoji: '🐾' },
    optionB: { text: 'Poder hablar y entender todos los idiomas humanos existentes', emoji: '🌍' },
  },
  {
    id: 'd-4',
    category: 'dilemas',
    optionA: { text: 'Saber exactamente qué está pensando tu pareja en todo momento', emoji: '🧠' },
    optionB: { text: 'Que tu pareja siempre sepa lo que necesitas sin que digas nada', emoji: '❤️' },
  },
];
