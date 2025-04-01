import React from 'react';

import Button from '@/components/Button';
import { GameEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';

const ChooseWord = () => {
  const { room } = useRoom();
  const { user } = useUser();
  const { asyncEmitEvent } = useSocket();
  const isDrawing = user.id === room.drawerId;

  const mockWords = [
    {
      word: 'WORD A',
    },
    {
      word: 'WORD B',
    },
    {
      word: 'WORD C',
    },
  ];

  const handleWordChoice = async (word: string) => {
    await asyncEmitEvent(GameEvents.EMIT_GAME_CHOOSE_WORD, {
      roomId: room.id,
      word,
    });
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-chalk-yellow">
      <p>{texts.game.chooseWord.title[isDrawing ? 'drawer' : 'hunchers']}</p>
      {isDrawing &&
        mockWords.map(({ word }, index) => (
          <Button key={index} onClick={() => handleWordChoice(word)}>
            {word}
          </Button>
        ))}
    </div>
  );
};

export default ChooseWord;
