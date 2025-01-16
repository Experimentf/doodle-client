import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { SnackbarContext } from './SnackbarContext';

const socket = io('http://localhost:5000', { autoConnect: false });

export const SocketContext = createContext<Socket>(socket);

const SocketProvider = ({ children }: PropsWithChildren) => {
  const { open: openSnackbar } = useContext(SnackbarContext);

  const handleConnect = () => {
    console.info('Connected to server!');
  };

  const handleConnectError = () => {
    openSnackbar({
      message: 'Could not connect!',
      color: 'error',
      isInfinite: true,
    });
  };

  const handleDisconnect = () => {
    console.error('Disconnected from server!');
  };

  useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
