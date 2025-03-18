import { Coordinate } from '@/types/common';

export const getPixelHexCode = (
  context: CanvasRenderingContext2D,
  position: Coordinate
) => {
  const imageData = context.getImageData(position.x, position.y, 1, 1);
  const [r, g, b] = imageData.data;
  return convertRGBToHex(r, g, b);
};

export const convertHexToRGB = (hex: string) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

export const convertRGBToHex = (red: number, green: number, blue: number) => {
  const hexRed = red.toString(16).padStart(2, '0');
  const hexGreen = green.toString(16).padStart(2, '0');
  const hexBlue = blue.toString(16).padStart(2, '0');
  return `#${hexRed}${hexGreen}${hexBlue}`;
};

export const getPointsByBFS = (
  point: Coordinate,
  validator: (coord: Coordinate) => boolean,
  maxWidth: number,
  maxHeight: number
): Array<Coordinate> => {
  const result: Coordinate[] = [point];

  const isValidCoordinate = (coord: Coordinate) => {
    if (coord.x < 0 || coord.x > maxWidth) return false;
    if (coord.y < 0 || coord.y > maxHeight) return false;
    return validator(coord);
  };

  const convertToKey = (coord: Coordinate) => `${coord.x},${coord.y}`;

  const diff = [-1, 0, 1];
  const nDiff = diff.length;
  const queue = [point];
  const visited = new Set<string>([convertToKey(point)]);

  while (queue.length > 0) {
    const cur = queue.shift();
    if (!cur) break;

    for (let i = 0; i < nDiff; i++) {
      for (let j = 0; j < nDiff; j++) {
        if (diff[i] == 0 && diff[j] == 0) continue;
        const neighbour: Coordinate = {
          x: cur.x + diff[i],
          y: cur.y + diff[j],
        };

        const stringifiedNeighbour = convertToKey(neighbour);
        const isValidNeighbour = isValidCoordinate(neighbour);

        if (isValidNeighbour && !visited.has(stringifiedNeighbour)) {
          queue.push(neighbour);
          visited.add(convertToKey(neighbour));
          result.push(neighbour);
        }
      }
    }
  }

  return result;
};
