export interface CipherMessage {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clue?: string;
  authorNote?: string;
  paragraphs: string[];
}

export const CIPHER_ALPHABET: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9, J: 10,
  K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17, R: 18, S: 19, T: 20,
  U: 21, V: 22, W: 23, X: 24, Y: 25, Z: 26,
};

export const NUMBER_TO_LETTER: Record<number, string> = Object.fromEntries(
  Object.entries(CIPHER_ALPHABET).map(([l, n]) => [n, l])
);

/**
 * Convierte un texto a su representación numérica.
 * Mantiene espacios y saltos de línea.
 */
export function encodeToCipher(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes para el cifrado clásico
    .split(' ')
    .map((word) =>
      word
        .split('')
        .map((char) => CIPHER_ALPHABET[char] || char)
        .join(' ')
    )
    .join(' / ');
}

export const PRESET_CIPHER_MESSAGES: CipherMessage[] = [
  {
    id: 'original-love-code',
    title: 'El Mensaje de Nuestra Lámina',
    subtitle: 'El código secreto original guardado en nuestro libro de recuerdos',
    difficulty: 'medium',
    clue: 'Una declaración de amor eterno...',
    paragraphs: [
      'NICOLAS EN ESTA VIDA Y EN TODAS',
      'TE ELEGIRIA UNA Y MIL VECES',
      'MI LUGAR FAVORITO SIEMPRE SERA A TU LADO',
    ],
  },
  {
    id: 'sweet-home',
    title: 'Nuestro Refugio',
    subtitle: 'Una verdad sobre lo que construimos juntos',
    difficulty: 'easy',
    clue: 'Donde pertenezco...',
    paragraphs: [
      'ERES MI HOGAR Y MI MAYOR AVENTURA',
      'CONTIGO EL MUNDO SE SIENTE SEGURO Y EN PAZ',
    ],
  },
  {
    id: 'infinite-promise',
    title: 'Promesa Secreta',
    subtitle: 'Un pacto silencioso de complicidad',
    difficulty: 'easy',
    clue: 'Un compromiso del corazón...',
    paragraphs: [
      'PROMETO HACERTE REIR TODOS LOS DIAS',
      'Y CUIDAR DE NUESTRO AMOR POR SIEMPRE',
    ],
  },
];
