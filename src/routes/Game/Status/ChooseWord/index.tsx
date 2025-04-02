import React from 'react';

import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import Loading from '@/components/Loading';
import Text from '@/components/Text';
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

  if (!isDrawing) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div>
          <Text>{drawer?.name + texts.game.chooseWord.title.hunchers}</Text>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <Dialog visible title={texts.game.chooseWord.title.drawer}>
      <div className="flex flex-auto gap-2 mt-5 justify-center">
        {wordChoices ? (
          wordChoices.map((word, index) => (
            <Button
              key={index}
              variant="secondary"
              className="whitespace-nowrap"
              onClick={() => handleWordChoice(word)}
            >
              {word}
            </Button>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </Dialog>
  );
};

export default ChooseWord;
