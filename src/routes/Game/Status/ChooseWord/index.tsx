import React from 'react';

import Backdrop from '@/components/Backdrop';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { GameEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';

interface ChooseWordInterface {
  wordChoices?: Array<string>;
}

const ChooseWord = ({ wordChoices }: ChooseWordInterface) => {
  const { room } = useRoom();
  const { user } = useUser();
  const { asyncEmitEvent } = useSocket();
  const isDrawing = user.id === room.drawerId;
  const drawer = room.doodlers.find(({ id }) => id === room.drawerId);

  const handleWordChoice = async (word: string) => {
    await asyncEmitEvent(GameEvents.EMIT_GAME_CHOOSE_WORD, {
      roomId: room.id,
      word,
    });
  };

  return (
    <Backdrop>
      <p className="text-center">
        {isDrawing
          ? texts.game.chooseWord.title.drawer
          : drawer?.name + texts.game.chooseWord.title.hunchers}
      </p>
      {isDrawing && (
        <div className="flex flex-auto gap-2 mt-5 justify-center">
          {wordChoices ? (
            wordChoices.map((word, index) => (
              <Button key={index} onClick={() => handleWordChoice(word)}>
                {word}
              </Button>
            ))
          ) : (
            <Loading />
          )}
        </div>
      )}
    </Backdrop>
  );
};

export default ChooseWord;
