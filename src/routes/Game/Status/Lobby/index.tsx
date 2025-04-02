import React from 'react';

import Loading from '@/components/Loading';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

const Lobby = () => {
  const { room } = useRoom();

  return (
    <>
      {!room.isPrivate && (
        <div>
          <p className="text-center">{texts.game.lobby.waiting}</p>
          <Loading />
        </div>
      )}
    </>
  );
};

export default Lobby;
