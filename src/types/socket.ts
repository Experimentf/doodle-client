import { Socket } from 'socket.io-client';

import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';

import { DoodlerInterface } from './models/doodler';
import { RoomInterface } from './models/room';

type EmitResponse<T> = { data?: T | null; error?: Error };

type ClientToServerEventsArgument<T, K> = {
  payload: T;
  response: EmitResponse<K>;
};

export interface ClientToServerEventsArgumentMap {
  [DoodlerEvents.EMIT_GET_DOODLER]: ClientToServerEventsArgument<
    undefined,
    Pick<DoodlerInterface, 'name'>
  >;
  [DoodlerEvents.EMIT_SET_DOODLER]: ClientToServerEventsArgument<
    Pick<DoodlerInterface, 'name' | 'avatar'>,
    DoodlerInterface
  >;
  [RoomEvents.EMIT_ADD_DOODLER_TO_PUBLIC_ROOM]: ClientToServerEventsArgument<
    DoodlerInterface,
    { roomId: RoomInterface['id'] }
  >;
  [GameEvents.EMIT_GET_GAME_DETAILS]: ClientToServerEventsArgument<
    string,
    null
  >;
}

export interface ServerToClientEvents {
  [RoomEvents.ON_DOODLER_JOIN]: (args: { doodler: DoodlerInterface }) => void;
  [RoomEvents.ON_DOODLER_LEAVE]: (args: { doodler: DoodlerInterface }) => void;
  [GameEvents.ON_GAME_START]: () => void;
  [GameEvents.ON_GAME_LOBBY]: () => void;
  [GameEvents.ON_GAME_END]: () => void;
}

export type ClientToServerEvents = {
  [Key in keyof ClientToServerEventsArgumentMap]: (
    payload: ClientToServerEventsArgumentMap[Key]['payload'],
    responseHandler: (
      response: ClientToServerEventsArgumentMap[Key]['response']
    ) => void
  ) => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
