import { Socket } from 'socket.io-client';

import {
  DoodlerClientToServerEventsArgumentMap,
  DoodlerServerToClientEvents,
} from './doodler';
import {
  GameClientToServerEventsArgumentMap,
  GameServerToClientEvents,
} from './game';
import {
  RoomClientToServerEventsArgumentMap,
  RoomServerToClientEvents,
} from './room';

export type ClientToServerEventsArgumentMap =
  DoodlerClientToServerEventsArgumentMap &
    GameClientToServerEventsArgumentMap &
    RoomClientToServerEventsArgumentMap;

export type ServerToClientEvents = DoodlerServerToClientEvents &
  GameServerToClientEvents &
  RoomServerToClientEvents;

export type ClientToServerEvents = {
  [Key in keyof ClientToServerEventsArgumentMap]: (
    payload: ClientToServerEventsArgumentMap[Key]['payload'],
    responseHandler: (
      response: ClientToServerEventsArgumentMap[Key]['response']
    ) => void
  ) => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
