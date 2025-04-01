import React from 'react';

import Backdrop from '@/components/Backdrop';
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
    <Backdrop>
      <p className="text-center">
        {texts.game.chooseWord.title[isDrawing ? 'drawer' : 'hunchers']}
      </p>
      {isDrawing && (
        <div className="flex flex-auto gap-2 mt-5 justify-center">
          {mockWords.map(({ word }, index) => (
            <Button key={index} onClick={() => handleWordChoice(word)}>
              {word}
            </Button>
          ))}
        </div>
      )}
    </Backdrop>
  );
};

export default ChooseWord;
