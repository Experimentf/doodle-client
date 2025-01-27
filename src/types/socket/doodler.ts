import { DoodlerEvents } from '@/constants/Events';

import { DoodlerInterface } from '../models/doodler';
import { ClientToServerEventsArgument } from './helper';

export interface DoodlerClientToServerEventsArgumentMap {
  [DoodlerEvents.EMIT_GET_DOODLER]: ClientToServerEventsArgument<
    undefined,
    Pick<DoodlerInterface, 'name'>
  >;
  [DoodlerEvents.EMIT_SET_DOODLER]: ClientToServerEventsArgument<
    Pick<DoodlerInterface, 'name' | 'avatar'>,
    DoodlerInterface
  >;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DoodlerServerToClientEvents {}
