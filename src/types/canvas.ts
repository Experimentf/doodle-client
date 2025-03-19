import { Coordinate } from './common';

export enum CanvasAction {
  LINE = 'line',
  FILL = 'fill',
  ERASE = 'erase',
  CLEAR = 'clear',
  BATCH_LINE = 'batchLine',
  BATCH_ERASE = 'batchErase',
  LOAD_OPERATIONS = 'loadOperations',
}

export interface CanvasOperation {
  actionType: CanvasAction;
  points?: Array<Coordinate>;
  color?: string;
  size?: number;
}
