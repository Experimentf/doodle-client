import { Coordinate } from '@/types/common';
import { convertHexToRGB } from '@/utils/colors';

// Worker Fundamental
const fillWorker = self as unknown as Worker;

export interface FillWorkerRequest {
  id: number;
  buffer: ArrayBuffer;
  width: number;
  height: number;
  point: Coordinate;
  newColor: string;
}

export interface FillBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface FillWorkerResponse {
  id: number;
  buffer: ArrayBuffer;
  width: number;
  height: number;
  bbox: FillBoundingBox;
}

fillWorker.onmessage = (event: MessageEvent<FillWorkerRequest>) => {
  const { id, buffer, width, height, point, newColor } = event.data;
  const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
  const { bbox } = scanlineFill(imageData, point, newColor, width, height);
  const outBuffer = imageData.data.buffer;
  const response: FillWorkerResponse = {
    id,
    buffer: outBuffer,
    width,
    height,
    bbox,
  };
  fillWorker.postMessage(response, [outBuffer]);
};

// Utilities
// Covers GPU readback rounding (typically off by 1-2 per channel) without
// being wide enough to conflate two distinct user-picked colors.
const COLOR_MATCH_TOLERANCE = 6;

function colorsMatch(
  a: { r: number; g: number; b: number },
  r: number,
  g: number,
  b: number
) {
  return (
    Math.abs(a.r - r) <= COLOR_MATCH_TOLERANCE &&
    Math.abs(a.g - g) <= COLOR_MATCH_TOLERANCE &&
    Math.abs(a.b - b) <= COLOR_MATCH_TOLERANCE
  );
}

function scanlineFill(
  imageData: ImageData,
  point: Coordinate,
  newColor: string,
  maxWidth: number,
  maxHeight: number
): { imageData: ImageData; bbox: FillBoundingBox } {
  const data = imageData.data;
  const newColorRGB = convertHexToRGB(newColor);
  // Pointer coordinates arrive fractional (CSS-to-canvas scaling); indices must be integers.
  const seedX = Math.min(Math.max(Math.floor(point.x), 0), maxWidth - 1);
  const seedY = Math.min(Math.max(Math.floor(point.y), 0), maxHeight - 1);
  const seedIndex = (seedY * maxWidth + seedX) * 4;
  const previousColorRGB = {
    r: data[seedIndex],
    g: data[seedIndex + 1],
    b: data[seedIndex + 2],
  };

  // Empty box (zero width) so the caller's putImageData is a no-op.
  const bbox: FillBoundingBox = {
    minX: seedX,
    minY: seedY,
    maxX: seedX - 1,
    maxY: seedY - 1,
  };

  // Filled pixels would still match the target and be revisited forever.
  if (
    colorsMatch(previousColorRGB, newColorRGB.r, newColorRGB.g, newColorRGB.b)
  )
    return { imageData, bbox };

  const matches = (x: number, y: number) => {
    const index = (y * maxWidth + x) * 4;
    return colorsMatch(
      previousColorRGB,
      data[index],
      data[index + 1],
      data[index + 2]
    );
  };

  const fillPoint = (x: number, y: number) => {
    const index = (y * maxWidth + x) * 4;
    data[index] = newColorRGB.r;
    data[index + 1] = newColorRGB.g;
    data[index + 2] = newColorRGB.b;
    data[index + 3] = 255;
  };

  // Queue one seed per contiguous run on the adjacent row, not every pixel.
  const queueRuns = (startX: number, endX: number, y: number) => {
    if (y < 0 || y >= maxHeight) return;
    let inRun = false;
    for (let x = startX; x <= endX; x++) {
      if (matches(x, y)) {
        if (!inRun) queue.push(x, y);
        inRun = true;
      } else {
        inRun = false;
      }
    }
  };

  bbox.maxX = seedX;
  bbox.maxY = seedY;

  // Flat [x, y, x, y, ...] with a head index: Array#shift() is O(n) per call.
  const queue: number[] = [seedX, seedY];
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    // Already filled via another run since it was queued.
    if (!matches(x, y)) continue;

    let startX = x;
    while (startX > 0 && matches(startX - 1, y)) startX--;
    let endX = x;
    while (endX < maxWidth - 1 && matches(endX + 1, y)) endX++;

    for (let i = startX; i <= endX; i++) fillPoint(i, y);

    if (startX < bbox.minX) bbox.minX = startX;
    if (endX > bbox.maxX) bbox.maxX = endX;
    if (y < bbox.minY) bbox.minY = y;
    if (y > bbox.maxY) bbox.maxY = y;

    queueRuns(startX, endX, y - 1);
    queueRuns(startX, endX, y + 1);
  }

  return { imageData, bbox };
}

export default fillWorker;
