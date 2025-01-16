import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

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
  const { open: openSnackbar } = useContext(SnackbarContext);

  const handleConnect = () => {
    console.info('Connected to server!');
    setIsSocketConnected(true);
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
    console.error('DisSocketConnected from server!');
    setIsSocketConnected(false);
  };

  useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
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
