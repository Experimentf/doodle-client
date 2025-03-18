import { Coordinate } from '@/types/common';

export const getMidPoint = (a: Coordinate, b: Coordinate): Coordinate => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const floorCoordinate = (coordinate: Coordinate): Coordinate => ({
  x: Math.floor(coordinate.x),
  y: Math.floor(coordinate.y),
});
