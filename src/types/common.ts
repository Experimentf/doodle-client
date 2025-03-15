export type Coordinate = {
  x: number;
  y: number;
};

export enum CanvasOperationType {
  LINE,
  FILL,
  ERASE,
  CLEAR,
  UNKNOWN,
}

export interface CanvasOperation {
  type: CanvasOperationType;
}
