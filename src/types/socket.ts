import { Socket } from 'socket.io-client';

import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';

import { DoodlerInterface } from './models/doodler';

type EmitResponse<T> = (args: { data?: T | null; error?: Error }) => void;

export interface ServerToClientEvents {
  [RoomEvents.ON_DOODLER_JOIN]: (args: { doodler: DoodlerInterface }) => void;
  [RoomEvents.ON_DOODLER_LEAVE]: (args: { doodler: DoodlerInterface }) => void;
  [GameEvents.ON_GAME_START]: () => void;
  [GameEvents.ON_GAME_LOBBY]: () => void;
  [GameEvents.ON_GAME_END]: () => void;
}

export type ClientToServerEvents = {
  [DoodlerEvents.EMIT_GET_DOODLER]: (
    payload: undefined,
    responseHandler: EmitResponse<Pick<DoodlerInterface, 'name'>>
  ) => void;
  [DoodlerEvents.EMIT_SET_DOODLER]: (
    payload: Pick<DoodlerInterface, 'name' | 'avatar'>,
    responseHandler: EmitResponse<DoodlerInterface>
  ) => void;
  [RoomEvents.EMIT_ADD_DOODLER_TO_PUBLIC_ROOM]: (
    payload: DoodlerInterface,
    responseHandler: EmitResponse<{
      roomId: string;
    }>
  ) => void;
  [GameEvents.EMIT_GET_GAME_DETAILS]: (
    payload: string,
    responseHandler: EmitResponse<null>
  ) => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
