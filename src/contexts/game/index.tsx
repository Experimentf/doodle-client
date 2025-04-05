import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { GameInterface, GameStatus } from '@/types/models/game';

interface GameContextInterface {
  game: GameInterface;
  setGame: Dispatch<SetStateAction<GameInterface>>;
}

const defaultGame: GameInterface = {
  id: '',
  status: GameStatus.LOBBY,
  options: {
    round: { current: 0, max: 0 },
    timers: {
      drawing: { current: 0, max: 0 },
      turnEndCooldownTime: { current: 0, max: 0 },
      roundStartCooldownTime: { current: 0, max: 0 },
      chooseWordTime: { current: 0, max: 0 },
      resultCooldownTime: { current: 0, max: 0 },
    },
    word: '',
  },
  canvasOperations: [],
};

const GameContext = createContext<GameContextInterface>({
  game: defaultGame,
  setGame: () => {},
});

const GameProvider = ({ children }: PropsWithChildren) => {
  const [game, setGame] = useState<GameInterface>(defaultGame);

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

export default GameProvider;
