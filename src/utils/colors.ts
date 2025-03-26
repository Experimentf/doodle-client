import { Coordinate } from '@/types/common';

export const getPixelHexCode = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
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
