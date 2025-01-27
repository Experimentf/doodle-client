import { DoodlerInterface } from '@/types/models/doodler';

export const getDoodlerById = (doodlers: DoodlerInterface[], id?: string) => {
  if (!id) return undefined;
  return doodlers.find(({ id: mId }) => mId === id);
};
