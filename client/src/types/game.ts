import { AvatarProps } from '@bigheads/core';

export type MemberType = {
  id: string;
  name: string;
  avatar: AvatarProps;
  isOwner: boolean;
};

export type GameStatus = 'game' | 'lobby' | 'end';

export type RoomType = 'public' | 'private';

export type Room = {
  capacity: number;
  status: GameStatus;
  type: RoomType;
};
