import React, { PropsWithChildren, createContext, useState } from 'react';
import { GameStatus, MemberInterface, Room, RoomType } from '../types/game';

interface GameContextType {
  members: Array<MemberInterface>;
  updateMembers: (newMembers: Array<MemberInterface>) => void;
  room: Room;
  updateRoom: (newRoom: Room) => void;
}

const defaultValues = {
  members: [],
  updateMembers: () => {},
  room: {
    capacity: 0,
    status: GameStatus.LOBBY,
    type: RoomType.PUBLIC,
  },
  updateRoom: () => {},
};

export const GameContext = createContext<GameContextType>(defaultValues);

const GameProvider = ({ children }: PropsWithChildren) => {
  const [members, setMembers] = useState<Array<MemberInterface>>(
    defaultValues.members
  );
  const [room, setRoom] = useState<Room>(defaultValues.room);

  const updateMembers = (newMembers: Array<MemberInterface>) =>
    setMembers(newMembers);
  const updateRoom = (newRoom: Room) => setRoom(newRoom);

  return (
    <GameContext.Provider
      value={{
        members,
        updateMembers,
        room,
        updateRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
