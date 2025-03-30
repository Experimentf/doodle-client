import React from 'react';

import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';

const ChooseWord = () => {
  const { room } = useRoom();
  const { user } = useUser();
  const isDrawing = user.id === room.drawerId;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
      <p>{texts.game.chooseWord.title[isDrawing ? 'drawer' : 'hunchers']}</p>
    </div>
  );
};

export default ChooseWord;
