import React from 'react';

import texts from '@/constants/texts';

const TurnEnd = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
      <p>{texts.game.turnEnd.title}</p>
    </div>
  );
};

export default TurnEnd;
