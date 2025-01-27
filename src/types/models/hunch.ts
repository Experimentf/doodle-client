import { DoodlerInterface } from './doodler';

export enum HunchStatus {
  CORRECT = 'correct',
  CLOSE = 'close',
  WRONG = 'wrong',
}

export interface HunchInterface {
  senderId: DoodlerInterface['id'];
  message: string;
  status: HunchStatus;
}
