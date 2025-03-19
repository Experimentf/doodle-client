import { Coordinate } from '@/types/common';
import {
  convertHexToRGB,
  convertRGBToHex,
  getPointsByBFS,
} from '@/utils/canvas';

// Worker Fundamental
const fillWorker = self as unknown as Worker;

interface FillWorkerInput {
  imageData: ImageData;
  point: Coordinate;
  previousColor: string;
  newColor: string;
  maxWidth: number;
  maxHeight: number;
}

fillWorker.onmessage = (event: MessageEvent<FillWorkerInput>) => {
  const { imageData, point, previousColor, newColor, maxWidth, maxHeight } =
    event.data;
  const fillNeighbours = getFillNeighbours(
    imageData,
    point,
    previousColor,
    maxWidth,
    maxHeight
  );
  const newImageData = applyColorToNeighbours(
    imageData,
    fillNeighbours,
    newColor,
    maxWidth
  );
  fillWorker.postMessage(newImageData);
};

// Utilities
function getFillNeighbours(
  imageData: ImageData,
  point: Coordinate,
  color: string,
  maxWidth: number,
  maxHeight: number
) {
  function validator(coord: Coordinate) {
    const data = imageData.data;
    const index = (coord.y * maxWidth + coord.x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const hex = convertRGBToHex(r, g, b);
    return hex === color;
  }

  return getPointsByBFS(point, validator, maxWidth, maxHeight);
}

function applyColorToNeighbours(
  imageData: ImageData,
  fillNeighbours: Coordinate[],
  color: string,
  maxWidth: number
) {
  const data = imageData.data;
  const { r, g, b } = convertHexToRGB(color);
  for (const neighbour of fillNeighbours) {
    const index = (neighbour.y * maxWidth + neighbour.x) * 4;
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255;
  }

  return imageData;
}

export default fillWorker;
