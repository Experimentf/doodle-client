/* 
- Prepend "ON_" for events that are received by the client
- Prepend "EMIT_" for events that are emitted by the client
*/

export enum SocketEvents {
  ON_CONNECT = 'connect',
  ON_CONNECT_ERROR = 'connect_error',
  ON_DISCONNECT = 'disconnect',
}

export enum RoomEvents {
  EMIT_ADD_DOODLER_TO_PUBLIC_ROOM = 'add-doodler-to-public-room',
  EMIT_ADD_DOODLER_TO_PRIVATE_ROOM = 'add-doodler-to-private-room',
  EMIT_CREATE_PRIVATE_ROOM = 'create-private-room',
  EMIT_GET_ROOM = 'get-room',
  ON_DOODLER_JOIN = 'doodler-join',
  ON_DOODLER_LEAVE = 'doodler-leave',
}

export enum DoodlerEvents {
  EMIT_GET_DOODLER = 'get-doodler',
  EMIT_SET_DOODLER = 'set-doodler',
}

export enum GameEvents {
  EMIT_GET_GAME = 'get-game',
  EMIT_GAME_CANVAS_OPERATION = 'game-canvas-operation',
  EMIT_GAME_CHOOSE_WORD = 'game-choose-word',
  ON_GAME_STATUS_UPDATED = 'game-status-updated',
  ON_GAME_CANVAS_OPERATION = 'game-canvas-operation',
}
