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
  ServerToClientEvents,
  SocketType,
} from '@/types/socket';

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
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  registerEvent: () => {},
  emitEvent: () => {},
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
