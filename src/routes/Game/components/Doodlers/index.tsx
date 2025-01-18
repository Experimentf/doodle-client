import { useContext } from 'react';

import Avatar from '@/components/Avatar';
import texts from '@/constants/texts';
import { GameContext } from '@/contexts/GameContext';
import { SocketContext } from '@/contexts/SocketContext';

const Doodlers = () => {
  const { socket } = useContext(SocketContext);
  const { gameState } = useContext(GameContext);
  const userId = socket.id;

  return (
    <div className="max-w-[96]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed">
        <h1 className="text-lg whitespace-nowrap text-chalk-white">
          {texts.game.doodlers.sectionTitle}
        </h1>
        <hr className="my-2 text-chalk-white" />
        <div className="mt-2">
          {gameState.room.members.map((member, index) => (
            <div key={index} className="flex items-center gap-1">
              <h1>{index + 1}.</h1>
              <Avatar
                className="min-w-[80px] w-20"
                avatarProps={member.avatar}
              />
              <p className="text-light-chalk-white overflow-hidden text-ellipsis">
                {member.name}
              </p>
              {userId === member.id && (
                <span className="text-light-chalk-blue">
                  {texts.game.doodlers.userMarker}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doodlers;
