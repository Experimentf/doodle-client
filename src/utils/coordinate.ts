import { Coordinate } from '@/types/common';

export const getMidPoint = (a: Coordinate, b: Coordinate): Coordinate => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});
