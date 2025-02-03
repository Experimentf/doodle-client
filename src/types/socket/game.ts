import { GameEvents } from '@/constants/Events';

import { GameInterface } from '../models/game';
import { ClientToServerEventsArgument } from './helper';

export interface GameClientToServerEventsArgumentMap {
  [GameEvents.EMIT_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameEvents.ON_GAME_START]: () => void;
  [GameEvents.ON_GAME_LOBBY]: () => void;
  [GameEvents.ON_GAME_END]: () => void;
}
