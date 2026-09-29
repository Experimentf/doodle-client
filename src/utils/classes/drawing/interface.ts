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
  readonly hasOperations: boolean;

  // RESET EVERYTHING
  reset: () => void;

  // TEMPORARY OPERATION PREVIEW (E.G. STRAIGHT LINES) THAT IS NOT RECORDED
  beginPreview: () => void;
  preview: (canvasOperation: CanvasOperation) => void;
  endPreview: () => void;

  // NORMALIZE AND DENORMALIZE COORDINATES ACCORDING TO CANVAS
  normalizeCoordinate: (coord: Coordinate) => Coordinate;
  denormalizeCoordinate: (coord: Coordinate) => Coordinate;

  // NORMALIZE AND DENORMALIZE SIZE (E.G. BRUSH WIDTH) ACCORDING TO CANVAS
  normalizeSize: (size: number) => number;
  denormalizeSize: (size: number) => number;
}
