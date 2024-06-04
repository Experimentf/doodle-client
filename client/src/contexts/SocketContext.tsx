import React, { PropsWithChildren, createContext } from 'react';
import { Socket, io } from 'socket.io-client';

const socket = io('http://localhost:5000', { autoConnect: false });

export const SocketContext = createContext<Socket>(socket);

const SocketProvider = ({ children }: PropsWithChildren) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
