/* eslint-disable no-console */
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io } from 'socket.io-client';

import { SocketEvents, SocketIOEvents } from '@/constants/Events';
import useLogger from '@/hooks/useLogger';
import {
  ClientToServerEvents,
  ClientToServerEventsArgumentMap,
  ServerToClientEvents,
  SocketType,
} from '@/types/socket';
import { ErrorFromServer } from '@/utils/error';

import { useUser } from '../user';

const socket: SocketType = io(process.env.REACT_APP_DOODLE_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 2,
});

export enum SocketConnectionState {
  CONNECTING,
  RECONNECTING,
  CONNECTED,
  ERROR,
}

interface SocketContextType {
  socketConnectionState: SocketConnectionState;
  registerEvent: <T extends keyof ServerToClientEvents>(
    event: T,
    listener: ServerToClientEvents[T]
  ) => void;
  unregisterEvent: <T extends keyof ServerToClientEvents>(
    event: T,
    listener: ServerToClientEvents[T]
  ) => void;
  asyncEmitEvent: <T extends keyof ClientToServerEvents>(
    event: T,
    payload: ClientToServerEventsArgumentMap[T]['payload']
  ) => Promise<
    NonNullable<ClientToServerEventsArgumentMap[T]['response']['data']>
  >;
}

const SocketContext = createContext<SocketContextType>({
  socketConnectionState: SocketConnectionState.CONNECTING,
  registerEvent: () => {},
  unregisterEvent: () => {},
  asyncEmitEvent: () =>
    Promise.reject(new Error('Emitter not initialized yet!')),
});

const SocketProvider = ({ children }: PropsWithChildren) => {
  const { updateUser, resetUser } = useUser();
  const { logClientEmit } = useLogger();
  const [socketConnectionState, setSocketConnectionState] =
    useState<SocketConnectionState>(SocketConnectionState.CONNECTING);

  const handleConnectAttempt = () => {
    setSocketConnectionState(SocketConnectionState.CONNECTING);
  };

  const handleConnect = () => {
    console.info('Connected to server!');
    updateUser('id', socket.id ?? '');
    setSocketConnectionState(SocketConnectionState.CONNECTED);
  };

  const handleConnectError = () => {
    setSocketConnectionState(SocketConnectionState.ERROR);
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

  const unregisterEvent: SocketContextType['unregisterEvent'] = (
    event,
    listener
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.off(event, listener as any);
  };

  const asyncEmitEvent = async <T extends keyof ClientToServerEvents>(
    event: T,
    payload: ClientToServerEventsArgumentMap[T]['payload']
  ) => {
    const data = await (new Promise((resolve, reject) => {
      const args = [
        payload,
        (response) => {
          const { data, error } = response;
          if (process.env.NODE_ENV === 'development')
            logClientEmit(event, response);
          if (error || data === undefined) {
            reject(new ErrorFromServer(error?.message));
          } else resolve(data);
        },
      ] as Parameters<ClientToServerEvents[T]>;
      socket.emit(event, ...args);
    }) as Promise<ClientToServerEventsArgumentMap[T]['response']['data']>);
    if (!data) throw new ErrorFromServer('Something went wrong!');
    return data;
  };

  useEffect(() => {
    socket.on(SocketEvents.ON_CONNECT, handleConnect);
    // socket.on(SocketEvents.ON_CONNECT_ERROR, handleConnectError);
    socket.on(SocketEvents.ON_DISCONNECT, handleDisconnect);
    // socket.io.on(SocketIOEvents.ON_RECONNECT, handleConnect);
    socket.io.on(SocketIOEvents.ON_RECONNECT_ATTEMPT, handleConnectAttempt);
    socket.io.on(SocketIOEvents.ON_RECONNECT_FAILED, handleConnectError);
    handleConnectAttempt();
    socket.connect();

    return () => {
      socket.off(SocketEvents.ON_CONNECT, handleConnect);
      socket.off(SocketEvents.ON_CONNECT_ERROR, handleConnectError);
      socket.off(SocketEvents.ON_DISCONNECT, handleDisconnect);
    };
  }, []);

  console.log(socket);

  return (
    <SocketContext.Provider
      value={{
        socketConnectionState,
        registerEvent,
        unregisterEvent,
        asyncEmitEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
