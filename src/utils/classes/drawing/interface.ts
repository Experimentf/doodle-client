import { CanvasAction } from '@/types/canvas';
import { Coordinate } from '@/types/common';

export interface DrawingInterface {
  [CanvasAction.LINE]: (
    from: Coordinate,
    to: Coordinate,
    color: string,
    size: number
  ) => void;
  [CanvasAction.FILL]: (point: Coordinate, color: string) => void;
  [CanvasAction.ERASE]: (
    from: Coordinate,
    to: Coordinate,
    size: number
  ) => void;
  [CanvasAction.CLEAR]: () => void;
  [CanvasAction.BATCH_LINE]: (
    points: Coordinate[],
    color: string,
    size: number
  ) => void;
  [CanvasAction.BATCH_ERASE]: (points: Coordinate[], size: number) => void;
}
