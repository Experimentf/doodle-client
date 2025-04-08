import React from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';

interface TurnEndProps {
  scores?: Record<string, number>;
}

const TurnEnd = ({ scores }: TurnEndProps) => {
  const { game } = useGame();
  const { room } = useRoom();

  const doodlersWithScores = room.doodlers
    .map((doodler) => ({
      ...doodler,
      score: scores?.[doodler.id] ?? 0,
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
