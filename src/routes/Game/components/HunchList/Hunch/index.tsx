import { HTMLAttributes } from 'react';
import { FaUserSecret } from 'react-icons/fa6';

import Avatar from '@/components/Avatar';
import Text from '@/components/Text';
import { useRoom } from '@/contexts/room';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { ColorType } from '@/types/styles';
import { getDoodlerById } from '@/utils/game';

interface HunchProps extends HTMLAttributes<HTMLLIElement> {
  hunch: HunchInterface;
}

const Hunch = ({ hunch, ...props }: HunchProps) => {
  const { room } = useRoom();
  const doodler = getDoodlerById(room.doodlers, hunch.senderId);

  const convertHunchStatusToColor = (
    status: HunchInterface['status']
  ): ColorType => {
    switch (status) {
      case HunchStatus.CORRECT:
        return 'success';
      case HunchStatus.CLOSE:
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <li {...props}>
      {doodler ? (
        <Avatar avatarProps={doodler.avatar} className="w-10" />
      ) : (
        <FaUserSecret size={40} className="px-2 text-light-chalk-white" />
      )}
      <Text
        disabled={!doodler}
        color={convertHunchStatusToColor(hunch.status)}
        className="text-sm"
      >
        {hunch.message}
      </Text>
    </li>
  );
};
export default Hunch;
