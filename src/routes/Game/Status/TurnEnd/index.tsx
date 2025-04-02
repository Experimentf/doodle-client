import React from 'react';

import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';

const TurnEnd = () => {
  const { game } = useGame();

  return <div>{texts.game.turnEnd.title + ` “${game.options.word}”`}</div>;
};

export default TurnEnd;
