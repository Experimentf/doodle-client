import Avatar from '../../../../components/Avatar/Avatar';
import { MemberInterface } from '../../../../types/game';
import { useContext } from 'react';
import { SocketContext } from '../../../../contexts/SocketContext';

interface MembetListProps {
  members: MemberInterface[];
}

const MemberList = ({ members }: MembetListProps) => {
  const socket = useContext(SocketContext);
  const userId = socket.id;

  return (
    <div className="w-80">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed w-full">
        <h1 className="text-xl">Players</h1>
        <div className="mt-2">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-1">
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
