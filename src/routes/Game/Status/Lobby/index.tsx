import React from 'react';

import Loading from '@/components/Loading';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

import PrivateLobby from './PrivateLobby';

const Lobby = () => {
  const { room } = useRoom();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {room.isPrivate ? (
        <PrivateLobby />
      ) : (
        <div>
          <Text>{texts.game.lobby.waiting}</Text>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Lobby;
