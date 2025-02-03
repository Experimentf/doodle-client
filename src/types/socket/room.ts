import { RoomEvents } from '@/constants/Events';

import { DoodlerInterface } from '../models/doodler';
import { RoomInterface } from '../models/room';
import { ClientToServerEventsArgument } from './helper';

export interface RoomClientToServerEventsArgumentMap {
  [RoomEvents.EMIT_ADD_DOODLER_TO_PUBLIC_ROOM]: ClientToServerEventsArgument<
    DoodlerInterface,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.EMIT_ADD_DOODLER_TO_PRIVATE_ROOM]: ClientToServerEventsArgument<
    DoodlerInterface,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.EMIT_CREATE_PRIVATE_ROOM]: ClientToServerEventsArgument<
    undefined,
    { roomId: RoomInterface['id'] }
  >;
  [RoomEvents.EMIT_GET_ROOM]: ClientToServerEventsArgument<
    string,
    { room: RoomInterface }
  >;
}

export interface RoomServerToClientEvents {
  [RoomEvents.ON_DOODLER_JOIN]: (args: { doodler: DoodlerInterface }) => void;
  [RoomEvents.ON_DOODLER_LEAVE]: (args: { doodler: DoodlerInterface }) => void;
}
