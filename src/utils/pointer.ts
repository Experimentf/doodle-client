import { Coordinate } from '@/types/common';

export const pointerEventToCoordinate = (ev: PointerEvent): Coordinate => ({
  x: ev.offsetX,
  y: ev.offsetY,
});
