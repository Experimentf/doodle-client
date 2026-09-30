import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

import PrivateLobby from './PrivateLobby';

const Lobby = () => {
  const { room } = useRoom();

  if (room.isPrivate) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <PrivateLobby />
      </div>
    );
  }

  // The canvas underneath is a scratchpad (see Main), so this stays a small, click-through note at the top.
  return (
    <div className="w-full h-full flex justify-center items-start p-3 pointer-events-none select-none">
      <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-black/30">
        <Text className="text-sm">
          {texts.game.lobby.waiting}
          <span className="animate-pulse">...</span>
        </Text>
        <Text className="text-xs text-light-chalk-white">
          {texts.game.lobby.scratchpad}
        </Text>
      </div>
    </div>
  );
};

export default Lobby;
