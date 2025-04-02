import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';

const RoundStart = () => {
  const { game } = useGame();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <Text>{texts.game.roundStart.title + game.options.round.current}</Text>
      </div>
    </div>
  );
};

export default RoundStart;
