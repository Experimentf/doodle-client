import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';

const Result = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <Text>{texts.game.result.title}</Text>
      </div>
    </div>
  );
};

export default Result;
