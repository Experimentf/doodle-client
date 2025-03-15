import { Coordinate } from './common';

export enum CanvasOperationType {
  LINE,
  ERASE,
  CLEAR,
}

export interface CanvasOperation {
  type: CanvasOperationType;
  from?: Coordinate;
  to?: Coordinate;
  color?: string;
  prevColor?: string;
  size?: number;
  imageData?: ImageData; // Saved only for CLEAR operation
}
