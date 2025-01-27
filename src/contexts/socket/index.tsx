import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';
import { io } from 'socket.io-client';

import { SocketEvents } from '@/constants/Events';
import {
  ClientToServerEvents,
  ClientToServerEventsArgumentMap,
  ServerToClientEvents,
  SocketType,
} from '@/types/socket';
import { ErrorFromServer } from '@/utils/error';

import { useSnackbar } from '../snackbar';
import { useUser } from '../user';

const SERVER_URI =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const socket: SocketType = io(SERVER_URI, { autoConnect: false });

interface SocketContextType {
  isConnected: boolean;
  registerEvent: <T extends keyof ServerToClientEvents>(
    event: T,
    listener: ServerToClientEvents[T]
  ) => void;
  emitEvent: <T extends keyof ClientToServerEvents>(
    event: T,
    ...args: Parameters<ClientToServerEvents[T]>
  ) => void;
  emitEventAsync: <T extends keyof ClientToServerEvents>(
    event: T,
    payload: ClientToServerEventsArgumentMap[T]['payload']
  ) => Promise<ClientToServerEventsArgumentMap[T]['response']['data']>;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  registerEvent: () => {},
  emitEvent: () => {},
  emitEventAsync: () =>
    Promise.reject(new Error('Emitter not initialized yet!')),
});

const SocketProvider = ({ children }: PropsWithChildren) => {
  const { updateUser, resetUser } = useUser();

  const { openSnackbar, closeSnackbar } = useSnackbar();

  const handleConnect = () => {
    console.info('Connected to server!');
    updateUser('id', socket.id ?? '');
    closeSnackbar();
  };

  const handleConnectError = () => {
    openSnackbar({
      message: 'Could not connect!',
      color: 'error',
      isInfinite: true,
    });
    resetUser();
  };

  const handleDisconnect = () => {
    console.error('Disconnected from server!');
    resetUser();
  };

  const registerEvent: SocketContextType['registerEvent'] = (
    event,
    listener
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event, listener as any);
  };

  const emitEvent: SocketContextType['emitEvent'] = (event, ...args) => {
    socket.emit(event, ...args);
  };

  const emitEventAsync = async <T extends keyof ClientToServerEvents>(
    event: T,
    payload: ClientToServerEventsArgumentMap[T]['payload']
  ) => {
    try {
      const data = await (new Promise((resolve, reject) => {
        const args = [
          payload,
          (response) => {
            const { data, error } = response;
            if (error || data === undefined)
              reject(error ?? new ErrorFromServer());
            else resolve(data);
          },
        ] as Parameters<ClientToServerEvents[T]>;
        socket.emit(event, ...args);
      }) as Promise<ClientToServerEventsArgumentMap[T]['response']['data']>);
      return data;
    } catch (e) {
      if (e instanceof ErrorFromServer) {
        openSnackbar({ message: e.message, color: 'error' });
      } else openSnackbar({ color: 'error' });
      return undefined;
    }
  };

  useEffect(() => {
    socket.on(SocketEvents.ON_CONNECT, handleConnect);
    socket.on(SocketEvents.ON_CONNECT_ERROR, handleConnectError);
    socket.on(SocketEvents.ON_DISCONNECT, handleDisconnect);
    socket.connect();

    return () => {
      socket.off(SocketEvents.ON_CONNECT, handleConnect);
      socket.off(SocketEvents.ON_CONNECT_ERROR, handleConnectError);
      socket.off(SocketEvents.ON_DISCONNECT, handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected: socket.connected,
        registerEvent,
        emitEvent,
        emitEventAsync,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
