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
  renderLineArt: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const coloringPages: ColoringPage[] = [
  {
    id: 'botanical-peonies',
    title: { es: 'Peonías & Hojas Silvestres', en: 'Wild Peonies & Foliage' },
    subtitle: { es: 'Flores delicadas para pintar a cuatro manos', en: 'Delicate blooms to color hand in hand' },
    category: 'Botanical',
    imagePath: '/images/coloring-01.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer delicate frame
      ctx.strokeRect(30, 30, w - 60, h - 60);

      // Central Flower
      const cx = w / 2;
      const cy = h / 2 - 20;

      // Center core
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Petal layers
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const px = cx + Math.cos(angle) * 75;
        const py = cy + Math.sin(angle) * 75;
        ctx.beginPath();
        ctx.ellipse(px, py, 42, 28, angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer petals
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 + 0.3;
        const px = cx + Math.cos(angle) * 135;
        const py = cy + Math.sin(angle) * 135;
        ctx.beginPath();
        ctx.ellipse(px, py, 58, 38, angle + 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Stems and leaves
      ctx.beginPath();
      ctx.moveTo(cx, cy + 150);
      ctx.quadraticCurveTo(cx - 30, cy + 260, cx - 10, h - 40);
      ctx.stroke();

      // Leaf left
      ctx.beginPath();
      ctx.ellipse(cx - 80, cy + 220, 55, 26, -0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 120, cy + 200);
      ctx.lineTo(cx - 40, cy + 240);
      ctx.stroke();

      // Leaf right
      ctx.beginPath();
      ctx.ellipse(cx + 80, cy + 250, 60, 28, 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 40, cy + 230);
      ctx.lineTo(cx + 120, cy + 270);
      ctx.stroke();
    },
  },
  {
    id: 'two-coffee-cups',
    title: { es: 'Dos Tazas de Café en la Mañana', en: 'Two Morning Coffee Mugs' },
    subtitle: { es: 'El ritual silencioso antes de empezar el día', en: 'The quiet ritual before the day starts' },
    category: 'Cozy Moments',
    imagePath: '/images/coloring-02.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      // Wooden Table Line
      ctx.beginPath();
      ctx.moveTo(40, h - 140);
      ctx.lineTo(w - 40, h - 140);
      ctx.stroke();

      // Left Mug
      const mx1 = w / 2 - 100;
      const my1 = h / 2 + 60;
      // Body
      ctx.beginPath();
      ctx.roundRect(mx1 - 60, my1 - 70, 120, 140, [10, 10, 30, 30]);
      ctx.stroke();
      // Handle
      ctx.beginPath();
      ctx.arc(mx1 - 70, my1, 28, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      // Heart on mug
      ctx.beginPath();
      ctx.moveTo(mx1, my1 - 10);
      ctx.bezierCurveTo(mx1 - 25, my1 - 40, mx1 - 40, my1 + 5, mx1, my1 + 30);
      ctx.bezierCurveTo(mx1 + 40, my1 + 5, mx1 + 25, my1 - 40, mx1, my1 - 10);
      ctx.stroke();

      // Right Mug
      const mx2 = w / 2 + 100;
      const my2 = h / 2 + 50;
      // Body
      ctx.beginPath();
      ctx.roundRect(mx2 - 60, my2 - 80, 120, 150, [10, 10, 30, 30]);
      ctx.stroke();
      // Handle
      ctx.beginPath();
      ctx.arc(mx2 + 70, my2 - 10, 28, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
      // Stripes on right mug
      ctx.beginPath();
      ctx.moveTo(mx2 - 50, my2 - 20);
      ctx.lineTo(mx2 + 50, my2 - 20);
      ctx.moveTo(mx2 - 50, my2 + 15);
      ctx.lineTo(mx2 + 50, my2 + 15);
      ctx.stroke();

      // Rising warm steam curls
      ctx.beginPath();
      ctx.moveTo(mx1 - 20, my1 - 90);
      ctx.bezierCurveTo(mx1 - 40, my1 - 150, mx1, my1 - 170, mx1 - 10, my1 - 220);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mx1 + 20, my1 - 90);
      ctx.bezierCurveTo(mx1, my1 - 150, mx1 + 40, my1 - 170, mx1 + 20, my1 - 220);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mx2, my2 - 100);
      ctx.bezierCurveTo(mx2 - 30, my2 - 160, mx2 + 20, my2 - 180, mx2, my2 - 230);
      ctx.stroke();
    },
  },
  {
    id: 'celestial-sun-moon',
    title: { es: 'El Sol y la Luna Abrazados', en: 'Sun & Moon in Embrace' },
    subtitle: { es: 'Dos energías que se complementan en equilibrio', en: 'Two celestial energies in perfect harmony' },
    category: 'Celestial',
    imagePath: '/images/coloring-03.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2;
      const r = 140;

      // Outer circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Crescent Moon inside
      ctx.beginPath();
      ctx.arc(cx, cy, r - 5, -Math.PI * 0.5, Math.PI * 0.5, false);
      ctx.quadraticCurveTo(cx - 30, cy, cx, cy - r + 5);
      ctx.stroke();

      // Moon eye closed
      ctx.beginPath();
      ctx.arc(cx + 40, cy - 30, 18, 0, Math.PI);
      ctx.stroke();

      // Sun Rays around
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const r1 = r + 15;
        const r2 = r + (i % 2 === 0 ? 55 : 35);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle - 0.08) * r1, cy + Math.sin(angle - 0.08) * r1);
        ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
        ctx.lineTo(cx + Math.cos(angle + 0.08) * r1, cy + Math.sin(angle + 0.08) * r1);
        ctx.closePath();
        ctx.stroke();
      }

      // Starlight specks
      const stars = [
        [cx - 180, cy - 180],
        [cx + 190, cy - 160],
        [cx - 170, cy + 170],
        [cx + 180, cy + 180],
      ];
      stars.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.stroke();
      });
    },
  },
  {
    id: 'intertwined-hands',
    title: { es: 'Manos Entrelazadas', en: 'Intertwined Hands' },
    subtitle: { es: 'Un pacto de caminar juntos paso a paso', en: 'A silent promise to walk side by side' },
    category: 'Intimate',
    imagePath: '/images/coloring-04.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2;

      // Stylized gentle hands holding
      ctx.beginPath();
      // Left arm and wrist
      ctx.moveTo(80, cy + 80);
      ctx.lineTo(cx - 50, cy + 40);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(80, cy + 160);
      ctx.lineTo(cx - 40, cy + 110);
      ctx.stroke();

      // Right arm and wrist
      ctx.beginPath();
      ctx.moveTo(w - 80, cy - 60);
      ctx.lineTo(cx + 50, cy - 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w - 80, cy + 20);
      ctx.lineTo(cx + 40, cy + 30);
      ctx.stroke();

      // Interlocking fingers
      ctx.beginPath();
      ctx.roundRect(cx - 70, cy - 20, 60, 90, 25);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(cx - 20, cy - 30, 60, 100, 25);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(cx + 30, cy - 20, 55, 90, 25);
      ctx.stroke();

      // Surrounding romantic botanical ring
      ctx.beginPath();
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    id: 'origami-cranes',
    title: { es: 'Mil Grullas de Amor', en: 'Origami Cranes of Hope' },
    subtitle: { es: 'Deseos plegados con paciencia y ternura', en: 'Wishes folded with patience and tenderness' },
    category: 'Paper Crafts',
    imagePath: '/images/coloring-05.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const drawCrane = (ox: number, oy: number, scale: number) => {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(scale, scale);

        // Body facets
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(-70, 20);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(70, 20);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.stroke();

        // Wings
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-110, -80);
        ctx.lineTo(-40, 10);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(110, -80);
        ctx.lineTo(40, 10);
        ctx.closePath();
        ctx.stroke();

        // Head and beak
        ctx.beginPath();
        ctx.moveTo(-70, 20);
        ctx.lineTo(-100, 50);
        ctx.lineTo(-95, 65);
        ctx.stroke();

        ctx.restore();
      };

      drawCrane(w / 2 - 80, h / 2 - 40, 1.2);
      drawCrane(w / 2 + 100, h / 2 + 60, 0.9);
    },
  },
  {
    id: 'wine-candlelight',
    title: { es: 'Copas de Vino & Velas', en: 'Wine by Candlelight' },
    subtitle: { es: 'La sobremesa interminable de un viernes', en: 'The lingering conversation of a late Friday' },
    category: 'Date Night',
    imagePath: '/images/coloring-06.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2;

      // Central Candle in Glass
      ctx.beginPath();
      ctx.roundRect(cx - 30, cy - 20, 60, 120, [8, 8, 16, 16]);
      ctx.stroke();

      // Flame
      ctx.beginPath();
      ctx.moveTo(cx, cy - 70);
      ctx.quadraticCurveTo(cx - 16, cy - 40, cx, cy - 24);
      ctx.quadraticCurveTo(cx + 16, cy - 40, cx, cy - 70);
      ctx.stroke();

      // Left Wine Glass
      const gx1 = cx - 120;
      ctx.beginPath();
      ctx.ellipse(gx1, cy - 40, 38, 55, 0, 0, Math.PI);
      ctx.lineTo(gx1 - 38, cy - 40);
      ctx.stroke();
      // Wine level
      ctx.beginPath();
      ctx.moveTo(gx1 - 30, cy - 15);
      ctx.lineTo(gx1 + 30, cy - 15);
      ctx.stroke();
      // Stem
      ctx.beginPath();
      ctx.moveTo(gx1, cy + 15);
      ctx.lineTo(gx1, cy + 90);
      ctx.stroke();
      // Base
      ctx.beginPath();
      ctx.ellipse(gx1, cy + 95, 30, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Right Wine Glass
      const gx2 = cx + 120;
      ctx.beginPath();
      ctx.ellipse(gx2, cy - 40, 38, 55, 0, 0, Math.PI);
      ctx.lineTo(gx2 - 38, cy - 40);
      ctx.stroke();
      // Wine level
      ctx.beginPath();
      ctx.moveTo(gx2 - 30, cy - 15);
      ctx.lineTo(gx2 + 30, cy - 15);
      ctx.stroke();
      // Stem
      ctx.beginPath();
      ctx.moveTo(gx2, cy + 15);
      ctx.lineTo(gx2, cy + 90);
      ctx.stroke();
      // Base
      ctx.beginPath();
      ctx.ellipse(gx2, cy + 95, 30, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    id: 'mountain-cabin',
    title: { es: 'Cabaña en las Colinas', en: 'Cabin in the Hills' },
    subtitle: { es: 'La escapada secreta de fin de semana', en: 'Our secret weekend getaway far from everything' },
    category: 'Travel',
    imagePath: '/images/coloring-07.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      // Mountains in background
      ctx.beginPath();
      ctx.moveTo(40, h / 2);
      ctx.lineTo(w / 3, h / 4);
      ctx.lineTo(w / 2 + 40, h / 2 + 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w / 3 + 20, h / 3);
      ctx.lineTo(w * 0.75, h / 5);
      ctx.lineTo(w - 40, h / 2 + 40);
      ctx.stroke();

      // Cabin
      const cbx = w / 2 - 80;
      const cby = h / 2 + 30;

      // Roof
      ctx.beginPath();
      ctx.moveTo(cbx - 20, cby);
      ctx.lineTo(cbx + 80, cby - 70);
      ctx.lineTo(cbx + 180, cby);
      ctx.closePath();
      ctx.stroke();

      // Walls
      ctx.strokeRect(cbx, cby, 160, 110);

      // Door & Window
      ctx.strokeRect(cbx + 20, cby + 35, 35, 75);
      ctx.strokeRect(cbx + 85, cby + 35, 45, 45);

      // Pine trees
      const drawPine = (px: number, py: number) => {
        ctx.beginPath();
        ctx.moveTo(px, py - 60);
        ctx.lineTo(px - 30, py - 20);
        ctx.lineTo(px + 30, py - 20);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, py - 30);
        ctx.lineTo(px - 40, py + 20);
        ctx.lineTo(px + 40, py + 20);
        ctx.closePath();
        ctx.stroke();
      };

      drawPine(w / 2 + 150, h / 2 + 100);
      drawPine(w / 2 - 130, h / 2 + 110);
    },
  },
  {
    id: 'love-letter-envelope',
    title: { es: 'Carta & Sello de Cera', en: 'Letter & Wax Seal' },
    subtitle: { es: 'Palabras sinceras escritas a pluma', en: 'Heartfelt words written with ink and thought' },
    category: 'Keepsakes',
    imagePath: '/images/coloring-08.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2;

      // Envelope Body
      ctx.strokeRect(cx - 140, cy - 80, 280, 180);

      // Flap lines
      ctx.beginPath();
      ctx.moveTo(cx - 140, cy - 80);
      ctx.lineTo(cx, cy + 20);
      ctx.lineTo(cx + 140, cy - 80);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 140, cy + 100);
      ctx.lineTo(cx - 40, cy + 10);
      ctx.moveTo(cx + 140, cy + 100);
      ctx.lineTo(cx + 40, cy + 10);
      ctx.stroke();

      // Wax Seal in center
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 34, 0, Math.PI * 2);
      ctx.stroke();

      // Heart monogram in seal
      ctx.beginPath();
      ctx.moveTo(cx, cy + 14);
      ctx.bezierCurveTo(cx - 15, cy, cx - 22, cy + 26, cx, cy + 38);
      ctx.bezierCurveTo(cx + 22, cy + 26, cx + 15, cy, cx, cy + 14);
      ctx.stroke();
    },
  },
  {
    id: 'heart-constellation',
    title: { es: 'Constelación del Corazón', en: 'Heart Constellation' },
    subtitle: { es: 'El mapa de estrellas que nos vio encontrarnos', en: 'The celestial map under which we met' },
    category: 'Celestial',
    imagePath: '/images/coloring-09.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2 - 10;

      // Constellation points forming a heart
      const points = [
        [cx, cy - 70],
        [cx - 50, cy - 120],
        [cx - 110, cy - 90],
        [cx - 130, cy - 30],
        [cx - 100, cy + 40],
        [cx - 50, cy + 90],
        [cx, cy + 140],
        [cx + 50, cy + 90],
        [cx + 100, cy + 40],
        [cx + 130, cy - 30],
        [cx + 110, cy - 90],
        [cx + 50, cy - 120],
      ];

      // Draw constellation connection lines
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw Star Nodes
      points.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.stroke();
      });
    },
  },
  {
    id: 'succulent-terrarium',
    title: { es: 'Terrario de Suculentas', en: 'Succulent Terrarium' },
    subtitle: { es: 'Un pequeño jardín que cuidamos día a día', en: 'A miniature garden nurtured day by day' },
    category: 'Botanical',
    imagePath: '/images/coloring-10.png',
    renderLineArt: (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1a181b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeRect(30, 30, w - 60, h - 60);

      const cx = w / 2;
      const cy = h / 2;

      // Geometrical glass terrarium jar
      ctx.beginPath();
      ctx.moveTo(cx, cy - 140);
      ctx.lineTo(cx + 120, cy - 50);
      ctx.lineTo(cx + 90, cy + 120);
      ctx.lineTo(cx - 90, cy + 120);
      ctx.lineTo(cx - 120, cy - 50);
      ctx.closePath();
      ctx.stroke();

      // Soil layers
      ctx.beginPath();
      ctx.moveTo(cx - 105, cy + 60);
      ctx.quadraticCurveTo(cx, cy + 75, cx + 105, cy + 60);
      ctx.stroke();

      // Central succulent rosette
      for (let i = 0; i < 7; i++) {
        const angle = (i * Math.PI) / 3.5;
        const sx = cx + Math.cos(angle) * 35;
        const sy = cy + 20 + Math.sin(angle) * 25;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 24, 14, angle, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  },
];
