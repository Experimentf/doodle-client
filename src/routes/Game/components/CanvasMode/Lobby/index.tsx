import React from 'react';

import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

const Lobby = () => {
  const { room } = useRoom();

  return (
    <>
      {!room.isPrivate && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
          <p>{texts.game.lobby.waiting}</p>
        </div>
      )}
    </>
  );
};

export default Lobby;
