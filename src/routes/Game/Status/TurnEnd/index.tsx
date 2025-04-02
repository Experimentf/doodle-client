import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';

const TurnEnd = () => {
  const { game } = useGame();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <Text>{texts.game.turnEnd.title + ` “${game.options.word}”`}</Text>
      </div>
    </div>
  );
};

export default TurnEnd;
