import { DoodlerInterface } from '@/types/game';

export const getDoodlerById = (doodlers: DoodlerInterface[], id: string) => {
  return doodlers.find(({ id: mId }) => mId === id);
};
