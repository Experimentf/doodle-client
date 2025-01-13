import Avatar from '../../../../components/Avatar/Avatar';
import { useContext } from 'react';
import { SocketContext } from '../../../../contexts/SocketContext';
import { GameContext } from '../../../../contexts/GameContext';

const MemberList = () => {
  const socket = useContext(SocketContext);
  const { members } = useContext(GameContext);
  const userId = socket.id;

  return (
    <div className="max-w-[96]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed">
        <h1 className="text-lg whitespace-nowrap">doodlers</h1>
        <hr className="my-2" />
        <div className="mt-2">
          {members.map((member, index) => (
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
                <span className="text-light-chalk-blue">(You)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
