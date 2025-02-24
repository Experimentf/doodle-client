import { GameEvents } from '@/constants/Events';

import { DoodlerInterface } from '../models/doodler';
import { GameInterface } from '../models/game';
import { ClientToServerEventsArgument } from './helper';

export interface GameClientToServerEventsArgumentMap {
  [GameEvents.EMIT_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameEvents.ON_GAME_START]: (args: {
    drawerId: DoodlerInterface['id'];
  }) => void;
  [GameEvents.ON_GAME_LOBBY]: (args: {
    drawerId: DoodlerInterface['id'] | undefined;
  }) => void;
  [GameEvents.ON_GAME_END]: (args: { drawerId: undefined }) => void;
}
