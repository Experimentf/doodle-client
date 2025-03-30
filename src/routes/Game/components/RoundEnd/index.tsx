import React from 'react';

import texts from '@/constants/texts';

const RoundEnd = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
      <p>{texts.game.roundEnd.title}</p>
    </div>
  );
};

export default RoundEnd;
