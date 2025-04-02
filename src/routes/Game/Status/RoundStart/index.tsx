import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';

const RoundStart = () => {
  const { game } = useGame();
  return (
    <div>
      <Text>{texts.game.roundStart.title + game.options.round.current}</Text>
    </div>
  );
};

export default RoundStart;
