import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';

interface TurnEndProps {
  scores?: Array<[string, number]>;
}

const TurnEnd = ({ scores }: TurnEndProps) => {
  const { game } = useGame();
  const { room } = useRoom();

  const findScore = (id: string) => {
    const row = scores?.find((score) => score[0] === id);
    if (!row) return 0;
    return row[1];
  };

  const doodlersWithScores = room.doodlers
    .map((doodler) => ({
      ...doodler,
      score: findScore(doodler.id),
    }))
    .sort((a, b) => a.score - b.score);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-5">
      <div>
        <Text>{texts.game.turnEnd.title + ` “${game.options.word}”`}</Text>
      </div>
      <table className="mt-3">
        {doodlersWithScores.map((doodler) => (
          <tr key={doodler.id} className="[&>td]:p-3">
            <td>
              <Text>{doodler.name}</Text>
            </td>
            <td>
              <Text color={doodler.score > 0 ? 'success' : 'error'}>
                <span>{doodler.score > 0 ? '+' : ''}</span>
                <span>{doodler.score}</span>
              </Text>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default TurnEnd;
