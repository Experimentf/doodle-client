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

export const convertRGBToLAB = (rgb: number[]): number[] => {
  const [red, green, blue] = rgb.map((c) => c / 255);
  const [x, y, z] = [
    (0.412453 * red + 0.35758 * green + 0.180423 * blue) / 0.95047,
    (0.212671 * red + 0.71516 * green + 0.072169 * blue) / 1.0,
    (0.019334 * red + 0.119193 * green + 0.950227 * blue) / 1.08883,
  ];
  const [l, a, b] = [
    116 * y ** (1 / 3) - 16,
    500 * (x ** (1 / 3) - y ** (1 / 3)),
    200 * (y ** (1 / 3) - z ** (1 / 3)),
  ];
  return [l, a, b];
};

export const cie76ColorDistance = (
  color1: number[],
  color2: number[]
): number => {
  const [l1, a1, b1] = convertRGBToLAB(color1);
  const [l2, a2, b2] = convertRGBToLAB(color2);
  const dL = l1 - l2;
  const dA = a1 - a2;
  const dB = b1 - b2;
  return Math.sqrt(dL ** 2 + dA ** 2 + dB ** 2);
};
