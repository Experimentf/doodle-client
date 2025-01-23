import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { SocketEvents } from '@/constants/Events';

import { SnackbarContext } from './SnackbarContext';

const SERVER_URI =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const socket = io(SERVER_URI, { autoConnect: false });

interface SocketContextType {
  socket: Socket;
  isSocketConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket,
  isSocketConnected: false,
});

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { open: openSnackbar, close: closeSnackbar } =
    useContext(SnackbarContext);

  const handleConnect = () => {
    console.info('Connected to server!');
    setIsSocketConnected(true);
    closeSnackbar();
  };

  const handleConnectError = () => {
    openSnackbar({
      message: 'Could not connect!',
      color: 'error',
      isInfinite: true,
    });
    setIsSocketConnected(false);
  };

  const handleDisconnect = () => {
    console.error('Disconnected from server!');
    setIsSocketConnected(false);
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
      value={{ socket, isSocketConnected: isSocketConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
