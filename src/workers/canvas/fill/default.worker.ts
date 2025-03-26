import { Coordinate } from '@/types/common';
import { convertHexToRGB, convertRGBToHex } from '@/utils/colors';

// Worker Fundamental
const fillDefaultWorker = self as unknown as Worker;

interface FillDefaultWorkerInput {
  imageData: ImageData;
  point: Coordinate;
  previousColor: string;
  newColor: string;
  maxWidth: number;
  maxHeight: number;
}

fillDefaultWorker.onmessage = (event: MessageEvent<FillDefaultWorkerInput>) => {
  const { imageData, point, previousColor, newColor, maxWidth, maxHeight } =
    event.data;
  const scanlineFilledImageData = fillWithScanline(
    imageData,
    point,
    previousColor,
    newColor,
    maxWidth,
    maxHeight
  );
  fillDefaultWorker.postMessage(scanlineFilledImageData);
};

function fillWithScanline(
  imageData: ImageData,
  point: Coordinate,
  previousColor: string,
  newColor: string,
  maxWidth: number,
  maxHeight: number
) {
  const newColorRGB = convertHexToRGB(newColor);

  const validate = (coord: Coordinate) => {
    if (coord.x < 0 || coord.x >= maxWidth) return false;
    if (coord.y < 0 || coord.y >= maxHeight) return false;
    const data = imageData.data;
    const index = (coord.y * maxWidth + coord.x) * 4;
    const [r, g, b] = data.slice(index, index + 4);
    const hex = convertRGBToHex(r, g, b);
    return hex === previousColor;
  };

  const fill = (coord: Coordinate) => {
    const index = (coord.y * maxWidth + coord.x) * 4;
    imageData.data[index] = newColorRGB.r;
    imageData.data[index + 1] = newColorRGB.g;
    imageData.data[index + 2] = newColorRGB.b;
    imageData.data[index + 3] = 255;
  };

  const queue = [point];
  while (queue.length > 0) {
    const neighbour = queue.shift();
    if (!neighbour) break;
    if (!validate(neighbour)) continue;
    const { x, y } = neighbour;
    let startX = x;
    while (startX >= 0 && validate({ x: startX, y })) startX--;
    startX++;
    let endX = x;
    while (endX < maxWidth && validate({ x: endX, y })) endX++;
    endX--;

    for (let i = startX; i <= endX; i++) {
      fill({ x: i, y: y });
      if (y > 0 && validate({ x: i, y: y - 1 })) queue.push({ x: i, y: y - 1 });
      if (y < maxHeight - 1 && validate({ x: i, y: y + 1 }))
        queue.push({ x: i, y: y + 1 });
    }
  }

  return imageData;
}

export default fillDefaultWorker;
