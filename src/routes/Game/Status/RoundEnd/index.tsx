import React from 'react';

import Backdrop from '@/components/Backdrop';
import texts from '@/constants/texts';

const RoundEnd = () => {
  return (
    <Backdrop>
      <p className="text-center">{texts.game.roundEnd.title}</p>
    </Backdrop>
  );
};

export default RoundEnd;
