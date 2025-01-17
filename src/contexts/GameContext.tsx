import React, { createContext, PropsWithChildren, useState } from 'react';

import { GameStatus, MemberInterface, Room, RoomType } from '@/types/game';

interface GameOptions {
  time: number;
  word: string;
  round: number;
  maxRounds: number;
}

interface GameState extends GameOptions {
  room: Room;
}

interface GameMethods {
  addMember: (member: MemberInterface) => void;
  removeMember: (member: MemberInterface) => void;
  updateRoom: <T extends keyof Room>(key: T, value: Room[T]) => void;
  updateGameOptions: <T extends keyof GameOptions>(
    key: T,
    value: GameOptions[T]
  ) => void;
}

interface GameContextType {
  gameState: GameState;
  gameMethods: GameMethods;
}

const defaultGameState: GameState = {
  room: {
    capacity: 0,
    status: GameStatus.LOBBY,
    type: RoomType.PUBLIC,
    members: [],
  },
  time: 0,
  word: 'DUMMY WORD',
  round: 0,
  maxRounds: 3,
};

export const GameContext = createContext<GameContextType>({
  gameState: defaultGameState,
  gameMethods: {
    addMember: () => {},
    removeMember: () => {},
    updateRoom: () => {},
    updateGameOptions: () => {},
  },
});

const GameProvider = ({ children }: PropsWithChildren) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Member
  const addMember: GameMethods['addMember'] = (member) => {
    setGameState((prev) => ({
      ...prev,
      room: { ...prev.room, members: [...prev.room.members, member] },
    }));
  };
  const removeMember: GameMethods['removeMember'] = (member) => {
    setGameState((prev) => ({
      ...prev,
      room: {
        ...prev.room,
        members: prev.room.members.filter(({ id }) => id === member.id),
      },
    }));
  };

  // Room
  const updateRoom: GameMethods['updateRoom'] = (key, value) => {
    setGameState((prev) => ({ ...prev, room: { ...prev.room, [key]: value } }));
  };

  // Game Options
  const updateGameOptions: GameMethods['updateGameOptions'] = (key, value) => {
    setGameState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        gameMethods: { addMember, removeMember, updateRoom, updateGameOptions },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
