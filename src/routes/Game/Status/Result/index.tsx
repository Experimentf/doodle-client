import React from 'react';

import Backdrop from '@/components/Backdrop';
import texts from '@/constants/texts';

const Result = () => {
  return (
    <Backdrop>
      <p className="text-center">{texts.game.result.title}</p>
    </Backdrop>
  );
};

export default Result;
