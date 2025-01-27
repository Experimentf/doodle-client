import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { RoomInterface } from '@/types/models/room';

interface RoomContextInterface {
  room: RoomInterface;
  setRoom: Dispatch<SetStateAction<RoomInterface>>;
}

const defaultRoom: RoomInterface = {
  id: '',
  capacity: 0,
  doodlers: [],
  isPrivate: true,
  ownerId: '',
  gameId: '',
};

const RoomContext = createContext<RoomContextInterface>({
  room: defaultRoom,
  setRoom: () => {},
});

const RoomProvider = ({ children }: PropsWithChildren) => {
  const [room, setRoom] = useState<RoomInterface>(defaultRoom);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);

export default RoomProvider;
