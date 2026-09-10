import { GameStatus } from '@/types/models/game';

import { playChooseWordPromptSound } from './soundChooseWordPrompt';
import { playGameStartSound } from './soundGameStart';
import { playResultSound } from './soundResult';
import { playRoundStartSound } from './soundRoundStart';
import { playTurnEndSound } from './soundTurnEnd';

// Maps each game status to its own distinct sound, so players can tell
// what just happened without looking at the screen. Statuses not listed
// here (e.g. the lobby) intentionally stay silent.
export function playGameStatusSound(status: GameStatus) {
  switch (status) {
    case GameStatus.CHOOSE_WORD:
      playChooseWordPromptSound();
      break;
    case GameStatus.GAME:
      playGameStartSound();
      break;
    case GameStatus.ROUND_START:
      playRoundStartSound();
      break;
    case GameStatus.TURN_END:
      playTurnEndSound();
      break;
    case GameStatus.RESULT:
      playResultSound();
      break;
    default:
      break;
  }
}
