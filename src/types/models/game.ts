import { CanvasOperation } from '../canvas';

export enum GameStatus {
  GAME = 'in_game', // A GAME IS GOING ON
  LOBBY = 'in_lobby', //  ROOM IS IN LOBBY
  CHOOSE_WORD = 'in_choose_word', // ROOM IS WAITING FOR DRAWER TO CHOOSE WORD
  ROUND_END = 'in_round_end', // ROOM IS SEEING A ROUND END
  RESULT = 'in_result', // ROOM IS SEEING THE GAME'S FINAL RESULT
}

export interface GameOptions {
  timers: {
    drawing: {
      current: number;
      max: number;
    };
    roundEndCooldownTime: {
      current: number;
      max: number;
    };
    chooseWordTime: {
      current: number;
      max: number;
    };
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
