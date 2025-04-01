import React from 'react';

import Backdrop from '@/components/Backdrop';
import Loading from '@/components/Loading';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

const Lobby = () => {
  const { room } = useRoom();

  return (
    <>
      {!room.isPrivate && (
        <Backdrop>
          <p className="text-center">{texts.game.lobby.waiting}</p>
          <Loading />
        </Backdrop>
      )}
    </>
  );
};

export default Lobby;
