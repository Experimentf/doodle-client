import { DoodlerInterface } from '@/types/game';

export const getDoodlerById = (doodlers: DoodlerInterface[], id?: string) => {
  if (!id) return undefined;
  return doodlers.find(({ id: mId }) => mId === id);
};
