import { AvatarConfig } from '@/utils/avatar';

export interface DoodlerInterface {
  id: string;
  name: string;
  avatar: AvatarConfig;
  score: number;
}
