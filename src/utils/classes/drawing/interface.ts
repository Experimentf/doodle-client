import { CanvasOperation } from '@/types/canvas';

export interface DrawingInterface {
  // LOAD ALL THE OPERATIONS ONTO THE CANVAS
  loadOperations: (
    canvasOperations: Array<CanvasOperation>,
    renderInFrames?: boolean
  ) => Promise<void>;
}
