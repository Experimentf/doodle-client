import { Coordinate } from '@/types/common';

export enum ShapeKind {
  LINE = 'Line',
  RECTANGLE = 'Rectangle',
  SQUARE = 'Square',
  ELLIPSE = 'Ellipse',
  CIRCLE = 'Circle',
}

// Square/circle: the larger drag distance on both axes, keeping the drag direction.
const toSquareCorner = (anchor: Coordinate, end: Coordinate): Coordinate => {
  const dx = end.x - anchor.x;
  const dy = end.y - anchor.y;
  const side = Math.max(Math.abs(dx), Math.abs(dy));
  return {
    x: anchor.x + (dx < 0 ? -side : side),
    y: anchor.y + (dy < 0 ? -side : side),
  };
};

const rectanglePoints = (a: Coordinate, b: Coordinate): Coordinate[] => [
  a,
  { x: b.x, y: a.y },
  b,
  { x: a.x, y: b.y },
  a,
];

const ellipsePoints = (a: Coordinate, b: Coordinate): Coordinate[] => {
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;
  const rx = Math.abs(b.x - a.x) / 2;
  const ry = Math.abs(b.y - a.y) / 2;
  // Ramanujan's perimeter; ~6px per segment, bounded so tiny shapes stay round and huge ones stay small on the wire.
  const perimeter =
    Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const segments = Math.min(180, Math.max(24, Math.round(perimeter / 6)));
  const points: Coordinate[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    points.push({
      x: Math.round(cx + rx * Math.cos(t)),
      y: Math.round(cy + ry * Math.sin(t)),
    });
  }
  return points;
};

// Outline of a shape dragged from anchor to end, as a polyline in the same (pixel) space.
export const getShapePoints = (
  kind: ShapeKind,
  anchor: Coordinate,
  end: Coordinate
): Coordinate[] => {
  switch (kind) {
    case ShapeKind.LINE:
      return [anchor, end];
    case ShapeKind.RECTANGLE:
      return rectanglePoints(anchor, end);
    case ShapeKind.SQUARE:
      return rectanglePoints(anchor, toSquareCorner(anchor, end));
    case ShapeKind.ELLIPSE:
      return ellipsePoints(anchor, end);
    case ShapeKind.CIRCLE:
      return ellipsePoints(anchor, toSquareCorner(anchor, end));
  }
};
