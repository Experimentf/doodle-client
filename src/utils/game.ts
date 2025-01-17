import { MemberInterface } from '@/types/game';

export const getMemberById = (members: MemberInterface[], id: string) => {
  return members.find(({ id: mId }) => mId === id);
};
