import { Coordinate } from '@/types/common';

export const getPixelHexCode = (
  context: CanvasRenderingContext2D,
  position: Coordinate
) => {
  const imageData = context.getImageData(position.x, position.y, 1, 1);
  const [r, g, b] = imageData.data;
  const hexRed = r.toString(16).padStart(2, '0');
  const hexGreen = g.toString(16).padStart(2, '0');
  const hexBlue = b.toString(16).padStart(2, '0');

  return `#${hexRed}${hexGreen}${hexBlue}`;
};
