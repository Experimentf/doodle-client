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
  status: GameStatus;
  options: GameOptions;
}
