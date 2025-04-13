import { GameEvents } from '@/constants/Events';

import { CanvasOperation } from '../canvas';
import { DoodlerInterface } from '../models/doodler';
import { GameInterface, GameStatus } from '../models/game';
import { HunchInterface } from '../models/hunch';
import { RoomInterface } from '../models/room';
import { ClientToServerEventsArgument } from './helper';

export interface PrivateGameOptions {
  drawing: number;
  round: number;
}

export interface GameStatusChangeData {
  [GameStatus.CHOOSE_WORD]?: {
    wordOptions: Array<string>;
  };
  [GameStatus.TURN_END]?: {
    scores: Record<DoodlerInterface['id'], number>;
  };
  [GameStatus.RESULT]?: {
    results: Record<DoodlerInterface['id'], number>;
  };
}

export interface GameClientToServerEventsArgumentMap {
  [GameEvents.EMIT_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
  [GameEvents.EMIT_GAME_CANVAS_OPERATION]: ClientToServerEventsArgument<
    { roomId: string; canvasOperation: CanvasOperation },
    { game: GameInterface }
  >;
  [GameEvents.EMIT_GAME_CHOOSE_WORD]: ClientToServerEventsArgument<
    { roomId: string; word: string },
    { game: GameInterface }
  >;
  [GameEvents.EMIT_GAME_HUNCH]: ClientToServerEventsArgument<
    {
      roomId: string;
      message: string;
    },
    {
      hunch: HunchInterface;
    }
  >;
  [GameEvents.EMIT_GAME_START_PRIVATE_GAME]: ClientToServerEventsArgument<
    { roomId: string; options: PrivateGameOptions },
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameEvents.ON_GAME_STATUS_UPDATED]: (args: {
    room: RoomInterface;
    game?: GameInterface;
    statusChangeData?: GameStatusChangeData;
  }) => void;
  [GameEvents.ON_GAME_CANVAS_OPERATION]: (args: {
    canvasOperation: CanvasOperation;
  }) => void;
  [GameEvents.ON_GAME_HUNCH]: (args: { hunch: HunchInterface }) => void;
}
