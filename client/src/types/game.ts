import { AvatarProps } from '@bigheads/core';

export interface MemberInterface {
  id: string;
  name: string;
  avatar: AvatarProps;
  isOwner: boolean;
}

export enum GameStatus {
  IN_GAME = 'game',
  LOBBY = 'lobby',
  END = 'end',
}

export enum RoomType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export type Room = {
  capacity: number;
  status: GameStatus;
  type: RoomType;
};
