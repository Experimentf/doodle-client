import { Socket } from 'socket.io-client';

import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';

import { DoodlerInterface } from './game';

type EmitResponse<T> = { data?: T | null; error?: Error };

interface ClientToServerEventsArguments {
  [DoodlerEvents.EMIT_GET_DOODLER]: [
    EmitResponse<Pick<DoodlerInterface, 'name'>>
  ];
  [DoodlerEvents.EMIT_SET_DOODLER]: [never];
  [RoomEvents.EMIT_ADD_DOODLER_TO_PUBLIC_ROOM]: [
    EmitResponse<{
      roomId: string;
    }>
  ];
  [GameEvents.EMIT_GET_GAME_DETAILS]: [EmitResponse<null>];
}

export interface ServerToClientEvents {
  [RoomEvents.ON_DOODLER_JOIN]: (doodler: DoodlerInterface) => void;
  [RoomEvents.ON_DOODLER_LEAVE]: (doodler: DoodlerInterface) => void;
  [GameEvents.ON_GAME_START]: () => void;
  [GameEvents.ON_GAME_LOBBY]: () => void;
  [GameEvents.ON_GAME_END]: () => void;
}

export type ClientToServerEvents = {
  [Key in keyof ClientToServerEventsArguments]: (
    ...args: ClientToServerEventsArguments[Key]
  ) => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
