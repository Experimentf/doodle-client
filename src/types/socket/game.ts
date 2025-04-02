import { GameEvents } from '@/constants/Events';

import { CanvasOperation } from '../canvas';
import { GameInterface } from '../models/game';
import { RoomInterface } from '../models/room';
import { ClientToServerEventsArgument } from './helper';

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
}

export interface GameServerToClientEvents {
  [GameEvents.ON_GAME_STATUS_UPDATED]: (args: {
    room: RoomInterface;
    game?: GameInterface;
    extraInfo?: {
      wordOptions?: Array<string>;
    };
  }) => void;
  [GameEvents.ON_GAME_CANVAS_OPERATION]: (args: {
    canvasOperation: CanvasOperation;
  }) => void;
}
