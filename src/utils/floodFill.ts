/**
 * Optimized Flood Fill Algorithm using BFS and Typed Arrays
 * Supports tolerance for anti-aliased line art outlines.
 */

interface RGB {
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
 * Checks if two colors match within a given tolerance threshold (0 - 255)
 */
function colorMatch(
  r1: number,
  g1: number,
  b1: number,
  a1: number,
  r2: number,
  g2: number,
  b2: number,
  a2: number,
  tolerance: number
): boolean {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance &&
    Math.abs(a1 - a2) <= tolerance
  );
}

/**
 * Determines if a pixel is considered a "black line art border"
 * to prevent leaking through dark edges.
 */
function isLineArtBorder(r: number, g: number, b: number, a: number): boolean {
  if (a < 50) return false;
  // If brightness is low, it's considered an outline border
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 80;
}

/**
 * Executes flood fill on an ImageData buffer
 * @param ctx 2D Canvas context
 * @param startX Starting X coordinate
 * @param startY Starting Y coordinate
 * @param fillColor Hex fill color (e.g. '#f43f5e')
 * @param tolerance Color matching tolerance (default: 32)
 * @returns boolean true if canvas was modified
 */
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number = 36
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

  // If clicked directly on a lineart border, do not fill
  if (isLineArtBorder(targetR, targetG, targetB, targetA)) {
    return false;
  }

  // If target color is already identical to fill color, skip
  if (
    colorMatch(
      targetR,
      targetG,
      targetB,
      targetA,
      fillRgb.r,
      fillRgb.g,
      fillRgb.b,
      fillRgb.a,
      5
    )
  ) {
    return false;
  }

  // Pre-calculate 32-bit fill representation for speed (Little Endian: ABGR)
  const fillValue =
    (fillRgb.a << 24) | (fillRgb.b << 16) | (fillRgb.g << 8) | fillRgb.r;

  const data32 = new Uint32Array(data.buffer);
  const visited = new Uint8Array(width * height);

  // Queue allocation (circular or preallocated index pointer)
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
    const pixelOffset = idx * 4;

    const curR = data[pixelOffset];
    const curG = data[pixelOffset + 1];
    const curB = data[pixelOffset + 2];
    const curA = data[pixelOffset + 3];

    // Paint pixel in 32-bit buffer
    data32[idx] = fillValue;

    // Check 4-connected neighbors
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

          // Stop if neighbor hits a dark line art border
          if (!isLineArtBorder(nr, ng, nb, na)) {
            // Check if neighbor matches initial clicked color within tolerance
            if (
              colorMatch(
                nr,
                ng,
                nb,
                na,
                targetR,
                targetG,
                targetB,
                targetA,
                tolerance
              )
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
  }

  // Put updated pixel data back to canvas
  ctx.putImageData(imageData, 0, 0);
  return true;
}
