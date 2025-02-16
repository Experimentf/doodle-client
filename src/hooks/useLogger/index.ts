/* eslint-disable no-console */
import {
  ClientToServerEvents,
  ClientToServerEventsArgumentMap,
  ServerToClientEvents,
} from '@/types/socket';

const useLogger = () => {
  const logClientEmit = <T extends keyof ClientToServerEvents>(
    event: T,
    response: ClientToServerEventsArgumentMap[T]['response']
  ) => {
    console.groupCollapsed('CLIENT EMIT INFO :', event);
    if (response.error) console.error(response.error);
    console.dir(response.data);
    console.groupEnd();
  };

  const logServerEmit = <T extends keyof ServerToClientEvents>(
    event: T,
    extraParams: Parameters<ServerToClientEvents[T]>
  ) => {
    console.groupCollapsed('SERVER EMIT INFO :', event);
    console.dir(extraParams);
    console.groupEnd();
  };

  return { logClientEmit, logServerEmit };
};

export default useLogger;
