import React, { createContext, PropsWithChildren, useState } from 'react';

import { DoodlerInterface, GameStatus, Room, RoomType } from '@/types/game';

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
  addDoodler: (doodler: DoodlerInterface) => void;
  removeDoodler: (doodler: DoodlerInterface) => void;
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
    doodlers: [],
  },
  time: 0,
  word: 'DUMMY WORD',
  round: 0,
  maxRounds: 3,
};

export const GameContext = createContext<GameContextType>({
  gameState: defaultGameState,
  gameMethods: {
    addDoodler: () => {},
    removeDoodler: () => {},
    updateRoom: () => {},
    updateGameOptions: () => {},
  },
});

const GameProvider = ({ children }: PropsWithChildren) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Doodler
  const addDoodler: GameMethods['addDoodler'] = (doodler) => {
    setGameState((prev) => ({
      ...prev,
      room: { ...prev.room, doodlers: [...prev.room.doodlers, doodler] },
    }));
  };
  const removeDoodler: GameMethods['removeDoodler'] = (doodler) => {
    setGameState((prev) => ({
      ...prev,
      room: {
        ...prev.room,
        doodlers: prev.room.doodlers.filter(({ id }) => id !== doodler.id),
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
        gameMethods: {
          addDoodler,
          removeDoodler,
          updateRoom,
          updateGameOptions,
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
