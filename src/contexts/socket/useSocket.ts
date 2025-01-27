import { useContext } from 'react';

import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';

import { SocketContext } from './SocketContext';

export const useSocket = () => {
  const { socket, isSocketConnected } = useContext(SocketContext);

  const registerEvent = <T extends keyof ServerToClientEvents>(
    event: T,
    listener: ServerToClientEvents[T]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event, listener as any);
  };

  const emitEvent = <T extends keyof ClientToServerEvents>(
    event: T,
    ...args: Parameters<ClientToServerEvents[T]>
  ) => {
    socket.emit(event, ...args);
  };

  return {
    id: socket.id,
    isConnected: isSocketConnected,
    registerEvent,
    emitEvent,
  };
};
