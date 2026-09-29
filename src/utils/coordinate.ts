import { Coordinate } from '@/types/common';

export const getMidPoint = (a: Coordinate, b: Coordinate): Coordinate => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const floorCoordinate = (coordinate: Coordinate): Coordinate => ({
  x: Math.floor(coordinate.x),
  y: Math.floor(coordinate.y),
});

// End point on the nearest 45° ray from anchor; whole-pixel steps keep diagonals exact.
export const snapTo45 = (anchor: Coordinate, point: Coordinate): Coordinate => {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const step = Math.PI / 4;
  const angle = Math.round(Math.atan2(dy, dx) / step) * step;
  const ux = Math.round(Math.cos(angle));
  const uy = Math.round(Math.sin(angle));
  const length = Math.max(
    0,
    Math.round((dx * ux + dy * uy) / (ux * ux + uy * uy))
  );
  return { x: anchor.x + ux * length, y: anchor.y + uy * length };
};
