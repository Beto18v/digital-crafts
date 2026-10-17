export interface StoryElement {
  value: number;
  label: string;
  sublabel?: string;
  icon: string;
  color: string;
}

export const STORY_DICE_DATA = {
  characters: [
    { value: 1, label: 'Una sirena', sublabel: 'encantadora', icon: '🧜‍♀️', color: '#f43f5e' },
    { value: 2, label: 'Un dragón', sublabel: 'travieso y verde', icon: '🐲', color: '#10b981' },
    { value: 3, label: 'Una princesa', sublabel: 'con corona brillante', icon: '👸', color: '#f59e0b' },
    { value: 4, label: 'Un duende', sublabel: 'mágico de los bosques', icon: '🧝‍♂️', color: '#84cc16' },
    { value: 5, label: 'Un robot', sublabel: 'con audífonos gamer', icon: '🤖', color: '#06b6d4' },
    { value: 6, label: 'Un hada', sublabel: 'con varita y alas rosas', icon: '🧚‍♀️', color: '#ec4899' },
  ] as StoryElement[],

  problems: [
    { value: 1, label: 'Se convierte en un pez', icon: '🐟', color: '#f97316' },
    { value: 2, label: 'Come demasiados insectos', icon: '🦗', color: '#84cc16' },
    { value: 3, label: 'Encuentra un diente brillante', icon: '🦷', color: '#6366f1' },
    { value: 4, label: 'Ve un esqueleto bailando', icon: '💀', color: '#64748b' },
    { value: 5, label: 'Se pierde sin mapa', icon: '🗺️', color: '#eab308' },
    { value: 6, label: 'Atrapa a un ladrón de besos', icon: '🦹‍♂️', color: '#ef4444' },
  ] as StoryElement[],

  settings: [
    { value: 1, label: 'Bajo el mar', icon: '🌊', color: '#0284c7' },
    { value: 2, label: 'En la cocina preparando cena', icon: '🍳', color: '#ea580c' },
    { value: 3, label: 'En una cueva misteriosa', icon: '🪨', color: '#78716c' },
    { value: 4, label: 'En un castillo medieval', icon: '🏰', color: '#8b5cf6' },
    { value: 5, label: 'En una acogedora casita', icon: '🏡', color: '#16a34a' },
    { value: 6, label: 'En una joyería resplandeciente', icon: '💎', color: '#d946ef' },
  ] as StoryElement[],
};

export const MONSTER_DICE_DATA = {
  bodies: [
    { value: 1, name: 'Óvalo con patitas', shape: 'oval' },
    { value: 2, name: 'Nube esponjosa', shape: 'cloud' },
    { value: 3, name: 'Erizo con púas', shape: 'hedgehog' },
    { value: 4, name: 'Búho con cuernos', shape: 'owl' },
    { value: 5, name: 'Triángulo travieso', shape: 'triangle' },
    { value: 6, name: 'Círculo regordete', shape: 'circle' },
  ],
  eyes: [
    { value: 1, name: 'Cíclope mimoso', count: 1 },
    { value: 2, name: 'Tres ojos curiosos', count: 3 },
    { value: 3, name: 'Dos ojos saltones', count: 2 },
    { value: 4, name: 'Ojos en antenas', count: 2 },
    { value: 5, name: 'Ojos con pestañitas', count: 2 },
    { value: 6, name: 'Ojos triangulares', count: 2 },
  ],
  mouths: [
    { value: 1, name: 'Un solo colmillo', type: 'tooth' },
    { value: 2, name: 'Dientes de conejo', type: 'bunny' },
    { value: 3, name: 'Boca zig-zag', type: 'zigzag' },
    { value: 4, name: 'Dientes de vampirito', type: 'vampire' },
    { value: 5, name: 'Sonrisa de oreja a oreja', type: 'smile' },
    { value: 6, name: 'Lengua afuera', type: 'tongue' },
  ],
  ears: [
    { value: 1, name: 'Orejas de duendecillo', type: 'elf' },
    { value: 2, name: 'Orejas de gatito', type: 'cat' },
    { value: 3, name: 'Antenas con bolita', type: 'antennas' },
    { value: 4, name: 'Antenas de robot', type: 'robot' },
    { value: 5, name: 'Cuernitos rayados', type: 'horns' },
    { value: 6, name: 'Antenas con corazón', type: 'hearts' },
  ],
};
