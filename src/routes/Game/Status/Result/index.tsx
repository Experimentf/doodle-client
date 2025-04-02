import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';

const Result = () => {
  return (
    <div>
      <Text>{texts.game.result.title}</Text>
    </div>
  );
};

export default Result;
