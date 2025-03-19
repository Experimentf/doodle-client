import { CanvasOperation } from '../canvas';

export enum GameStatus {
  GAME = 'in_game',
  LOBBY = 'in_lobby',
  END = 'in_end',
  RESULT = 'in_result',
}

export interface GameOptions {
  time: {
    current: number;
    max: number;
  };
  round: {
    current: number;
    max: number;
  };
  word: string;
}

export interface GameInterface {
  id: string;
  status: GameStatus;
  options: GameOptions;
  canvasOperations: Array<CanvasOperation>;
}
