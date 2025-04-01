import React from 'react';

import Backdrop from '@/components/Backdrop';
import texts from '@/constants/texts';

const RoundStart = () => {
  return (
    <Backdrop>
      <p className="text-center">{texts.game.roundStart.title}</p>
    </Backdrop>
  );
};

export default RoundStart;
