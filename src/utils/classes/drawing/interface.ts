import { CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';

export interface DrawingInterface {
  // LOAD ALL THE OPERATIONS ONTO THE CANVAS
  loadOperations: (
    canvasOperations: Array<CanvasOperation>,
    renderInFrames?: boolean,
    asNewOperation?: boolean
  ) => Promise<void>;

  // RELOAD EXISTING OPERATIONS
  reloadOperations: () => Promise<void>;

  // RESET EVERYTHING
  reset: () => void;

  // NORMALIZE AND DENORMALIZE COORDINATES ACCORDING TO CANVAS
  normalizeCoordinate: (coord: Coordinate) => Coordinate;
  denormalizeCoordinate: (coord: Coordinate) => Coordinate;
}
