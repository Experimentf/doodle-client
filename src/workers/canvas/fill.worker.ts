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
  previousColor: string;
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
  const { id, buffer, width, height, point, previousColor, newColor } =
    event.data;
  const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
  const { bbox } = scanlineFill(
    imageData,
    point,
    previousColor,
    newColor,
    width,
    height
  );
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
// Some desktop GPU compositing paths (e.g. canvases created with `alpha:
// false`) round RGB values by a channel or two when they're read back via
// getImageData, even though the color was originally set to an exact hex
// value. Comparing within a small tolerance keeps the fill robust to that.
const COLOR_MATCH_TOLERANCE = 16;

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
  previousColor: string,
  newColor: string,
  maxWidth: number,
  maxHeight: number
): { imageData: ImageData; bbox: FillBoundingBox } {
  const newColorRGB = convertHexToRGB(newColor);
  const previousColorRGB = convertHexToRGB(previousColor);

  const bbox: FillBoundingBox = {
    minX: point.x,
    minY: point.y,
    maxX: point.x,
    maxY: point.y,
  };

  const fillPoint = (coord: Coordinate) => {
    const index = (coord.y * maxWidth + coord.x) * 4;
    imageData.data[index] = newColorRGB.r;
    imageData.data[index + 1] = newColorRGB.g;
    imageData.data[index + 2] = newColorRGB.b;
    imageData.data[index + 3] = 255;
    if (coord.x < bbox.minX) bbox.minX = coord.x;
    if (coord.x > bbox.maxX) bbox.maxX = coord.x;
    if (coord.y < bbox.minY) bbox.minY = coord.y;
    if (coord.y > bbox.maxY) bbox.maxY = coord.y;
  };

  const validate = (coord: Coordinate) => {
    if (coord.x < 0 || coord.x >= maxWidth) return false;
    if (coord.y < 0 || coord.y >= maxHeight) return false;
    const data = imageData.data;
    const index = (coord.y * maxWidth + coord.x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    return colorsMatch(previousColorRGB, r, g, b);
  };

  // Index-based queue instead of Array#shift(), which is O(n) per call and
  // would make a large fill degrade toward O(n^2).
  const queue: Coordinate[] = [point];
  let head = 0;
  while (head < queue.length) {
    const neighbour = queue[head++];
    if (!validate(neighbour)) continue;
    const { x, y } = neighbour;
    let startX = x;
    while (startX >= 0 && validate({ x: startX, y })) startX--;
    startX++;
    let endX = x;
    while (endX < maxWidth && validate({ x: endX, y })) endX++;
    endX--;

    for (let i = startX; i <= endX; i++) {
      fillPoint({ x: i, y: y });
      if (y > 0 && validate({ x: i, y: y - 1 })) queue.push({ x: i, y: y - 1 });
      if (y < maxHeight - 1 && validate({ x: i, y: y + 1 }))
        queue.push({ x: i, y: y + 1 });
    }
  }

  return { imageData, bbox };
}

export default fillWorker;
