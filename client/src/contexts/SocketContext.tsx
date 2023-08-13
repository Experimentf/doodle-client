import React, { PropsWithChildren, createContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const SocketContext = createContext(socket);

const SocketProvider = ({ children }: PropsWithChildren) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
