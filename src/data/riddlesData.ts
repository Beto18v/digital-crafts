export interface Riddle {
  id: string;
  category: 'misterio' | 'lateral' | 'logica' | 'romantico' | 'biblioteca';
  title: string;
  question: string;
  hints: string[];
  answer: string;
  explanation: string;
  difficulty: 'Fácil' | 'Medio' | 'Ingenioso';
  emoji: string;
}

export const RIDDLE_CATEGORIES = [
  { id: 'todos', name: 'Todos los Acertijos', icon: '✨', desc: 'Mezcla variada para partidas llenas de sorpresas' },
  { id: 'lateral', name: 'Pensamiento Lateral', icon: '💡', desc: 'Acertijos con truco de ingenio donde nada es lo que parece' },
  { id: 'misterio', name: 'Casos & Detectives', icon: '🕵️', desc: 'Mini crímenes y deducciones lógicas de detectives' },
  { id: 'romantico', name: 'Románticos & Poéticos', icon: '💌', desc: 'Enigmas con juegos de palabras tiernos y cómplices' },
  { id: 'logica', name: 'Lógica Pura', icon: '🧠', desc: 'Desafíos mentales y patrones para ejercitar la mente' },
  { id: 'biblioteca', name: 'El Enigma de la Biblioteca', icon: '📚', desc: 'El puzzle deductivo original de la lámina con pistas' },
];

export const RIDDLE_BETS = [
  'Preparar el desayuno en la cama el domingo 🥐',
  'Dar un masaje de espalda de 15 minutos 💆',
  'Elegir qué cenar y la película de esta noche 🍕🎬',
  'Lavar los platos durante los próximos dos días 🧼',
  'Cumplir un capricho dulce o comprar helado 🍦',
  'Un beso apasionado de 30 segundos sin reírse 💋',
];

export const BASE_RIDDLES: Riddle[] = [
  // Pensamiento Lateral
  {
    id: 'lat-1',
    category: 'lateral',
    title: 'El Paraguas Olvidado',
    question: 'Cinco personas caminaban juntas bajo una lluvia torrencial durante 20 minutos sin paraguas, ni sombrero, ni impermeables, ni ningún techo donde guarecerse. Al llegar a su destino, a ninguna se le mojó ni un solo cabello de la cabeza. ¿Cómo es posible?',
    hints: [
      'No se trata de magia ni de una fuerza invisible.',
      'Fíjate bien en la palabra "cabello".',
      '¿Qué característica física comparten los cinco?',
    ],
    answer: 'Eran todos completamente calvos.',
    explanation: 'Al no tener cabello, ¡ningún cabello se les pudo mojar!',
    difficulty: 'Fácil',
    emoji: '🌧️',
  },
  {
    id: 'lat-2',
    category: 'lateral',
    title: 'La Habitación Oscura',
    question: 'Entras en una habitación fría y oscura de noche. Tienes en la mano una sola cerilla. En la habitación hay una lámpara de queroseno, una vela aromática y una chimenea de leña con madera seca. ¿Qué debes encender primero?',
    hints: [
      'Piensa en el orden físico de las acciones.',
      'No puedes encender la vela ni la chimenea sin algo previo.',
      '¿Qué tienes en la mano?',
    ],
    answer: 'La cerilla.',
    explanation: 'Para encender cualquiera de las otras cosas, primero tienes que encender la cerilla que tienes en la mano.',
    difficulty: 'Fácil',
    emoji: '🕯️',
  },
  {
    id: 'lat-3',
    category: 'lateral',
    title: 'El Conductor a Contramano',
    question: 'Un hombre va por una calle de sentido único en dirección contraria a los coches. La policía lo ve pasar de frente, pero no lo detiene ni le pone ninguna multa. ¿Por qué?',
    hints: [
      'La policía vio todo claramente y no es corrupta.',
      '¿En qué vehículo iba el hombre?',
      '¿Iba realmente en un vehículo?',
    ],
    answer: 'Iba caminando a pie.',
    explanation: 'Iba caminando por la acera o calle; la prohibición de sentido único solo aplica a los vehículos a motor.',
    difficulty: 'Medio',
    emoji: '🚶',
  },
  {
    id: 'lat-4',
    category: 'lateral',
    title: 'El Café sin Salpicar',
    question: 'A una persona se le cayó su anillo favorito dentro de una taza llena de café recién preparado, pero el anillo no se mojó en absoluto. ¿Cómo pudo ser?',
    hints: [
      'El anillo cayó efectivamente hasta el fondo de la taza.',
      'No había bolsa ni envoltorio protegiéndolo.',
      '¿En qué estado estaba el café?',
    ],
    answer: 'Era café en grano o en polvo soluble, aún no le habían agregado agua.',
    explanation: 'La taza estaba llena de café seco (en granos o en polvo).',
    difficulty: 'Medio',
    emoji: '☕',
  },
  {
    id: 'lat-5',
    category: 'lateral',
    title: 'Dos Hermanos Nacidos el Mismo Día',
    question: 'Dos personas nacieron de la misma madre, en el mismo hospital, el mismo día del mismo mes y del mismo año, pero no son gemelos ni mellizos. ¿Cómo es posible?',
    hints: [
      'La madre es biológica de ambos y dio a luz una sola vez ese día.',
      'No están mintiendo ni adoptados.',
      'Eran parte de un parto múltiple más grande.',
    ],
    answer: 'Eran trillizos (o cuatrillizos).',
    explanation: 'Eran parte de un parto de tres o más bebés.',
    difficulty: 'Ingenioso',
    emoji: '👶',
  },

  // Casos & Detectives
  {
    id: 'mis-1',
    category: 'misterio',
    title: 'El Suicidio Sospechoso',
    question: 'Un hombre fue encontrado muerto en su despacho con un disparo en la sien. En su mano derecha sostenía un arma y sobre el escritorio había una grabadora de cinta. La policía pulsa "Play" y se escucha la voz del hombre diciendo: "No puedo seguir con esta vida...", seguido del sonido de un disparo y silencio. Al instante, el detective dice: "Ha sido un asesinato". ¿Cómo lo supo?',
    hints: [
      'Presta atención al funcionamiento de una cinta de casete antigua.',
      '¿Qué ocurre con la cinta al sonar un disparo?',
      '¿Quién rebobinó la cinta?',
    ],
    answer: 'Si el hombre se disparó, no pudo haber rebobinado la cinta para que estuviera lista al inicio al presionar Play.',
    explanation: 'Alguien más tuvo que detener la grabación, rebobinarla al principio y colocarla en el escritorio.',
    difficulty: 'Medio',
    emoji: '📼',
  },
  {
    id: 'mis-2',
    category: 'misterio',
    title: 'La Ventana Rota desde Fuera',
    question: 'Un millonario denuncia que alguien rompió el cristal de la ventana de su mansión desde la calle con una piedra para entrar a robar su caja fuerte. El detective examina la habitación durante 10 segundos y arresta al millonario por falso testimonio. Todos los cristales rotos estaban dentro de la habitación. ¿Qué detalle delató que el millonario mentía?',
    hints: [
      'Los cristales estaban en el suelo del interior, como se esperaría si tiras una piedra desde fuera.',
      '¿Pero qué pasa cuando rompes un cristal desde dentro hacia afuera?',
      'Piensa en pequeños fragmentos diminutos o polvo de cristal en el alféizar.',
    ],
    answer: 'No había marcas de huellas ni polvo de cristal en el alféizar exterior, o el cristal fue roto desde dentro: si se rompe desde dentro, la mayor parte cae afuera excepto rebotes, pero en este caso las marcas de impacto de la piedra delataron la dirección.',
    explanation: 'El punto de fractura y las lascas microscópicas del vidrio demostraron que el impacto se dio desde el interior.',
    difficulty: 'Ingenioso',
    emoji: '🪟',
  },
  {
    id: 'mis-3',
    category: 'misterio',
    title: 'El Hielo en el Cóctel',
    question: 'Dos mujeres van a un restaurante y piden la misma bebida fría con hielo. Una de ellas tenía mucha sed y bebió 5 copas en 2 minutos. La otra mujer bebió solo una copa despacio charlando durante 40 minutos. La mujer que bebió despacio murió envenenada, pero la que bebió 5 copas sobrevivió ilesa. Ambas bebidas salieron de la misma jarra. ¿Cómo fue envenenada?',
    hints: [
      'La jarra de líquido no tenía veneno.',
      '¿Qué elemento había en las copas que cambia con el tiempo?',
      'El veneno tardó en liberarse.',
    ],
    answer: 'El veneno estaba en los cubitos de hielo.',
    explanation: 'La primera bebió tan rápido que el hielo no alcanzó a derretirse. La segunda bebió despacio y el veneno del hielo se derritió en su bebida.',
    difficulty: 'Medio',
    emoji: '🍸',
  },

  // Románticos & Poéticos
  {
    id: 'rom-1',
    category: 'romantico',
    title: 'Lo Que Crece al Compartirse',
    question: 'Cuanto más lo compartes con la persona que amas, más grande se hace. No cuesta dinero, no ocupa espacio en una maleta y es lo único que puede sanar un día gris sin decir una palabra. ¿Qué es?',
    hints: [
      'Se siente en el pecho.',
      'Puede expresarse con una mirada, un abrazo o una sonrisa.',
      'Es la razón por la que estamos aquí.',
    ],
    answer: 'El Amor (o el cariño / un abrazo sincero).',
    explanation: 'El amor es lo único que al dividirse y compartirse, se multiplica.',
    difficulty: 'Fácil',
    emoji: '💖',
  },
  {
    id: 'rom-2',
    category: 'romantico',
    title: 'Siempre Te Sigue',
    question: 'Camina contigo cuando hay luz, pero desaparece en la oscuridad. Nunca te deja solo de día, imita cada uno de tus pasos pero nunca emite ningún sonido. ¿Qué es?',
    hints: [
      'Baila en el suelo bajo el sol.',
      'Cambia de tamaño según la hora del día.',
      'No tiene peso.',
    ],
    answer: 'Tu sombra.',
    explanation: 'Nuestra sombra es la compañera fiel que refleja nuestros movimientos bajo la luz.',
    difficulty: 'Fácil',
    emoji: '👥',
  },
  {
    id: 'rom-3',
    category: 'romantico',
    title: 'El Hilo Invisible',
    question: 'No se puede tocar con las manos, pero si se rompe duele en el alma. Tarda meses o años en construirse piedra a piedra, pero puede quebrarse en un solo segundo. ¿Qué es?',
    hints: [
      'Es la base de cualquier relación sólida.',
      'Empieza por "C".',
      'Sin ella, el amor no puede florecer con paz.',
    ],
    answer: 'La Confianza.',
    explanation: 'La confianza es el pilar más valioso e íntimo de cualquier pareja.',
    difficulty: 'Medio',
    emoji: '🤝',
  },

  // Lógica Pura
  {
    id: 'log-1',
    category: 'logica',
    title: 'Las Tres Cajas con Etiquetas Falsas',
    question: 'Tienes tres cajas cerradas. Una contiene solo Manzanas, otra solo Naranjas y la tercera Manzanas y Naranjas mezcladas. Todas las cajas tienen una etiqueta en la tapa, pero TE ADVIERTEN que LAS TRES ETIQUETAS ESTÁN INCORRECTAS. Puedes sacar solo UNA fruta de UNA sola caja sin mirar dentro. ¿De qué caja debes sacar la fruta para saber con certeza el contenido de las tres?',
    hints: [
      'Aprovecha que TODAS las etiquetas están mal.',
      'Si sacas de la caja marcada como "Manzanas", sabes que NO son solo manzanas, pero podrían ser naranjas o mixta.',
      '¿Qué pasa si sacas de la caja marcada como "Mixta (Manzanas y Naranjas)"?',
    ],
    answer: 'Debes sacar una fruta de la caja etiquetada como "Mixta".',
    explanation: 'Como la etiqueta "Mixta" es falsa, esa caja es 100% de un solo tipo. Si sacas una manzana, esa caja es de manzanas. Luego, la caja con etiqueta "Naranjas" tiene que ser la mixta (porque no puede ser naranjas ni manzanas ya descubiertas), y la de "Manzanas" es la de naranjas.',
    difficulty: 'Ingenioso',
    emoji: '🍎',
  },
  {
    id: 'log-2',
    category: 'logica',
    title: 'El Puente y la Linterna',
    question: 'Cuatro personas deben cruzar un puente colgante estrecho de noche. El puente solo soporta a 2 personas a la vez y necesitan una linterna para ver por dónde pisan. Solo tienen una linterna. Cada persona tarda un tiempo distinto en cruzar: 1 min, 2 min, 7 min y 10 min. Cuando dos personas cruzan juntas, caminan a la velocidad del más lento. ¿Cuál es el tiempo mínimo necesario para que los cuatro crucen?',
    hints: [
      'Si el más rápido siempre acompaña y regresa la linterna, tardan 1+2 + 1+7 + 1+10 = 21 minutos, pero ¡se puede hacer en menos!',
      '¿Y si los dos más lentos (7 y 10) cruzan juntos para no perder tiempo por separado?',
      'El truco está en que el de 1 y el de 2 crucen primero.',
    ],
    answer: '17 minutos.',
    explanation: '1. Cruzan 1 y 2 (2 min). 2. Regresa 1 con la linterna (1 min = 3 min total). 3. Cruzan juntos los lentos 7 y 10 (10 min = 13 min total). 4. Regresa 2 con la linterna (2 min = 15 min total). 5. Cruzan 1 y 2 juntos (2 min = 17 minutos en total).',
    difficulty: 'Ingenioso',
    emoji: '🌉',
  },

  // El Enigma Clásico de la Biblioteca (Basado en la lámina original subida por el usuario)
  {
    id: 'bib-1',
    category: 'biblioteca',
    title: 'El Enigma de la Biblioteca (Pistas 1 a 6)',
    question: 'Cinco amigos (Ana, Bruno, Carla, Diego, Elena) eligieron un libro en la biblioteca. Cada libro tiene un género, un autor y un color de portada. Pistas: Diego leyó el libro de ciencia ficción y su autor fue George R.R. Martin. Ana eligió el libro de J.K. Rowling y de género Fantasía. El libro de misterio tiene portada roja. ¿Qué autor eligió Diego y de qué género es el libro de Ana?',
    hints: [
      'Revisa las pistas directas: Diego y Ana están explícitamente confirmados.',
      'Diego leyó ciencia ficción con autor George R.R. Martin.',
      'Ana eligió el libro de Fantasía de J.K. Rowling.',
    ],
    answer: 'Diego eligió a George R.R. Martin (Ciencia Ficción) y Ana eligió Fantasía (J.K. Rowling).',
    explanation: 'Las pistas 5, 6, 12 y 13 confirman directamente estas dos asignaciones.',
    difficulty: 'Fácil',
    emoji: '📖',
  },
  {
    id: 'bib-2',
    category: 'biblioteca',
    title: 'El Enigma de la Biblioteca: El Libro de Carla',
    question: 'Pistas: Carla leyó un libro de Aventura (Pista 8). El libro de aventura que eligió Carla tiene portada verde (Pista 11). Los autores posibles son: Isabel Allende, Agatha Christie, Dan Brown. El libro de Dan Brown tiene portada amarilla (Pista 7). El libro de Isabel Allende no tiene portada verde (Pista 9). ¿Quién es la autora del libro de Carla?',
    hints: [
      'El libro de Carla es verde.',
      'Dan Brown tiene portada amarilla (descartado).',
      'Isabel Allende no tiene portada verde (descartada).',
    ],
    answer: 'Agatha Christie.',
    explanation: 'Por descarte: no es Dan Brown (amarillo) ni Isabel Allende (no verde), por tanto el libro de aventuras con portada verde de Carla es de Agatha Christie.',
    difficulty: 'Medio',
    emoji: '🔍',
  },
  {
    id: 'bib-3',
    category: 'biblioteca',
    title: 'El Enigma de la Biblioteca: La Portada de Elena',
    question: 'Sabemos que: Carla tiene Verde (Aventura, Agatha Christie). El libro de Dan Brown es Amarillo (Pista 7). El libro de Misterio tiene portada Roja (Pista 2). El libro de George R.R. Martin no tiene portada azul (Pista 4). Si Ana eligió Fantasía con portada Azul y Elena eligió el libro de Dan Brown (Amarillo), ¿qué color de portada tiene el libro de Diego?',
    hints: [
      'Los colores son: Azul, Rojo, Verde, Amarillo, Morado.',
      'Carla = Verde. Ana = Azul. Elena = Amarillo.',
      'El libro de Diego (George R.R. Martin) no es azul.',
    ],
    answer: 'Morado.',
    explanation: 'Como el de Misterio es Rojo (Bruno) y Diego no puede ser Azul, a Diego le corresponde la portada Morada de Ciencia Ficción.',
    difficulty: 'Ingenioso',
    emoji: '📚',
  },
];
