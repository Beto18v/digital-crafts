/**
 * Optimized Flood Fill Algorithm using BFS and Typed Arrays
 * Supports color tolerance and line-art border threshold for anti-aliasing edges.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Converts a hex color string (#rrggbb or #rgb) to RGBA object
 */
export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 255,
  };
}

/**
 * Calculates Euclidean color distance between two pixels in RGBA space.
 */
export function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  a1: number,
  r2: number,
  g2: number,
  b2: number,
  a2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  const da = a1 - a2;
  return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
}

/**
 * Determines if a pixel is considered a "line-art border / wall".
 * Treats dark and gray anti-aliased edge pixels as solid boundaries to prevent color bleeding.
 *
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @param a Alpha component (0-255)
 * @param borderThreshold Brightness threshold below which pixels are treated as walls (default: 130)
 */
export function isLineArtBorder(
  r: number,
  g: number,
  b: number,
  a: number,
  borderThreshold: number = 130
): boolean {
  if (a < 50) return false;
  // Perceptual brightness formula (ITU-R BT.601)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Neutral gray/black anti-aliased edge detection (low saturation or very dark)
  const colorSpread = Math.max(r, g, b) - Math.min(r, g, b);
  const isNeutral = colorSpread < 50;

  return brightness <= borderThreshold && (isNeutral || brightness < 60);
}

/**
 * Executes flood fill on a 2D Canvas context with anti-aliasing wall protection.
 *
 * @param ctx 2D Canvas rendering context
 * @param startX Starting X coordinate
 * @param startY Starting Y coordinate
 * @param fillColorHex Hex fill color (e.g. '#f43f5e')
 * @param tolerance Color matching tolerance for region expansion (default: 36)
 * @param borderThreshold Brightness threshold where dark/gray pixels become impenetrable walls (default: 130)
 * @returns boolean true if the canvas was modified
 */
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number = 36,
  borderThreshold: number = 130
): boolean {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return false;
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const fillRgb = hexToRgb(fillColorHex);

  const startIndex = (startY * width + startX) * 4;
  const targetR = data[startIndex];
  const targetG = data[startIndex + 1];
  const targetB = data[startIndex + 2];
  const targetA = data[startIndex + 3];

  // If clicked directly on a line-art border (dark or gray line), do not paint
  if (isLineArtBorder(targetR, targetG, targetB, targetA, borderThreshold)) {
    return false;
  }

  // If target pixel is already the desired fill color, skip
  if (
    colorDistance(
      targetR,
      targetG,
      targetB,
      targetA,
      fillRgb.r,
      fillRgb.g,
      fillRgb.b,
      fillRgb.a
    ) <= 5
  ) {
    return false;
  }

  // Pre-calculate 32-bit little-endian color (ABGR)
  const fillValue =
    (fillRgb.a << 24) | (fillRgb.b << 16) | (fillRgb.g << 8) | fillRgb.r;
  const data32 = new Uint32Array(data.buffer);
  const visited = new Uint8Array(width * height);

  // Queue allocation
  const queueX = new Int32Array(width * height);
  const queueY = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  queueX[tail] = startX;
  queueY[tail] = startY;
  tail++;
  visited[startY * width + startX] = 1;

  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;

    const idx = y * width + x;
    data32[idx] = fillValue;

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;

        if (visited[nIdx] === 0) {
          const nOffset = nIdx * 4;
          const nr = data[nOffset];
          const ng = data[nOffset + 1];
          const nb = data[nOffset + 2];
          const na = data[nOffset + 3];

          // Treat gray or dark pixels as walls: stop expansion immediately
          if (isLineArtBorder(nr, ng, nb, na, borderThreshold)) {
            continue;
          }

          // Check if neighbor matches clicked target color within tolerance
          if (
            colorDistance(
              nr,
              ng,
              nb,
              na,
              targetR,
              targetG,
              targetB,
              targetA
            ) <= tolerance
          ) {
            visited[nIdx] = 1;
            queueX[tail] = nx;
            queueY[tail] = ny;
            tail++;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return true;
}
