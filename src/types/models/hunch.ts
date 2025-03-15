import { DoodlerInterface } from './doodler';

export enum HunchStatus {
  CORRECT = 'correct',
  NEARBY = 'nearby',
  WRONG = 'wrong',
}

export interface HunchInterface {
  senderId?: DoodlerInterface['id'];
  message: string;
  status?: HunchStatus;
  isSystemMessage: boolean;
}
