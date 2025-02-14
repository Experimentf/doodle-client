/* eslint-disable no-console */
import {
  ClientToServerEvents,
  ClientToServerEventsArgumentMap,
} from '@/types/socket';

const useLogger = () => {
  const logEmit = <T extends keyof ClientToServerEvents>(
    event: T,
    response: ClientToServerEventsArgumentMap[T]['response']
  ) => {
    console.groupCollapsed('EMIT INFO :', event);
    if (response.error) console.error(response.error);
    console.dir(response.data);
    console.groupEnd();
  };

  return { logEmit };
};

export default useLogger;
