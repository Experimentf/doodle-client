import { DoodlerInterface } from './doodler';

export interface RoomInterface {
  id: string;
  doodlers: Array<DoodlerInterface>;
  isPrivate: boolean;
  capacity: number;
  ownerId?: string;
  gameId?: string;
  drawerId?: string;
}
