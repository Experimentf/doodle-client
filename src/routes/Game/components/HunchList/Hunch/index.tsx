import { HTMLAttributes, useMemo } from 'react';
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

  const color = useMemo((): ColorType => {
    switch (hunch.status) {
      case HunchStatus.CORRECT:
        return 'success';
      case HunchStatus.NEARBY:
        return 'warning';
      default:
        return 'primary';
    }
  }, [hunch.status]);

  return (
    <li {...props}>
      {!hunch.isSystemMessage &&
        (doodler ? (
          <Avatar avatarProps={doodler.avatar} className="min-w-[2.5rem]" />
        ) : (
          <FaUserSecret size={40} className="px-2 text-light-chalk-white" />
        ))}
      <Text disabled={!doodler} color={color} className="text-sm my-[0.5rem]">
        {hunch.message}
      </Text>
    </li>
  );
};
export default Hunch;
