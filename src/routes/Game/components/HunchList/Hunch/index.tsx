import { HTMLAttributes, useContext } from 'react';

import Avatar from '@/components/Avatar';
import Text from '@/components/Text';
import { GameContext } from '@/contexts/GameContext';
import { getMemberById } from '@/utils/game';

import { HunchInterface } from '../types';
import { getColorFromHunchStatus } from '../utils';

interface HunchProps extends HTMLAttributes<HTMLLIElement> {
  hunch: HunchInterface;
}

const Hunch = ({ hunch, ...props }: HunchProps) => {
  const { gameState } = useContext(GameContext);
  const member = getMemberById(gameState.room.members, hunch.senderId);

  return (
    <li {...props}>
      <Avatar avatarProps={member?.avatar} className="w-10" />
      <Text color={getColorFromHunchStatus(hunch.status)} className="text-sm">
        {hunch.message}
      </Text>
    </li>
  );
};
export default Hunch;
