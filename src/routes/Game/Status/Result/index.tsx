import React, { useEffect } from 'react';

import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

interface ResultProps {
  results?: Record<string, number>;
}

const Result = ({ results }: ResultProps) => {
  const { room, setRoom } = useRoom();

  const doodlersWithScores = room.doodlers
    .map((doodler) => ({
      ...doodler,
      score: results?.[doodler.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  // Reset the scores
  useEffect(() => {
    setRoom((prev) => ({
      ...prev,
      doodlers: prev.doodlers.map((d) => ({ ...d, score: 0 })),
    }));
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <Text>{texts.game.result.title}</Text>
      </div>
      <table className="mt-3">
        {doodlersWithScores.map((doodler, index) => (
          <tr key={doodler.id} className="[&>td]:p-3">
            <td>
              <Text color="warning">#{index + 1}</Text>
            </td>
            <td>
              <Text>{doodler.name}</Text>
            </td>
            <td>
              <Text color={doodler.score > 0 ? 'success' : 'error'}>
                <span>{doodler.score}</span>
              </Text>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Result;
