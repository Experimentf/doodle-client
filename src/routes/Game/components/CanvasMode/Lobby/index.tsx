import React, { useContext } from 'react';

import texts from '@/constants/texts';
import { GameContext } from '@/contexts/game/GameContext';

const Lobby = () => {
  const { gameState } = useContext(GameContext);

  return (
    <>
      {gameState.room.type === 'public' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
          <p>{texts.game.lobby.waiting}</p>
        </div>
      )}
    </>
  );
};

export default Lobby;
