import React from 'react';

import Backdrop from '@/components/Backdrop';
import texts from '@/constants/texts';

const TurnEnd = () => {
  return (
    <Backdrop>
      <p className="text-center">{texts.game.turnEnd.title}</p>
    </Backdrop>
  );
};

export default TurnEnd;
