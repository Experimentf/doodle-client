import { CanvasOperation } from '@/types/canvas';

export interface DrawingInterface {
  // LOAD ALL THE OPERATIONS ONTO THE CANVAS
  loadOperations: (
    canvasOperations: Array<CanvasOperation>,
    renderInFrames?: boolean,
    asNewOperation?: boolean
  ) => Promise<void>;

  // RELOAD EXISTING OPERATIONS
  reloadOperations: () => Promise<void>;
}
