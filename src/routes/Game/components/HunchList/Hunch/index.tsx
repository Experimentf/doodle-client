import { HTMLAttributes, useContext } from 'react';
import { FaUserSecret } from 'react-icons/fa6';

import Avatar from '@/components/Avatar';
import Text from '@/components/Text';
import { GameContext } from '@/contexts/GameContext';
import { ColorType } from '@/types/styles';
import { getMemberById } from '@/utils/game';

import { HunchInterface } from '../types';

interface HunchProps extends HTMLAttributes<HTMLLIElement> {
  hunch: HunchInterface;
}

const Hunch = ({ hunch, ...props }: HunchProps) => {
  const { gameState } = useContext(GameContext);
  const member = getMemberById(gameState.room.members, hunch.senderId);

  const convertHunchStatusToColor = (
    status: HunchInterface['status']
  ): ColorType => {
    switch (status) {
      case 'success':
        return 'success';
      case 'close':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <li {...props}>
      {member ? (
        <Avatar avatarProps={member.avatar} className="w-10" />
      ) : (
        <FaUserSecret size={40} className="px-2 text-light-chalk-white" />
      )}
      <Text
        disabled={!member}
        color={convertHunchStatusToColor(hunch.status)}
        className="text-sm"
      >
        {hunch.message}
      </Text>
    </li>
  );
};
export default Hunch;
