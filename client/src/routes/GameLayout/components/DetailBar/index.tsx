import { useContext } from 'react';
import { GiAlarmClock, GiStarsStack } from 'react-icons/gi';
import { GameContext } from '../../../../contexts/GameContext';

const DetailBar = () => {
  const game = useContext(GameContext);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-4 bg-card-surface-2 rounded-lg w-full">
        <div className="flex flex-row items-center gap-2">
          <GiAlarmClock size={36} />
          <h1>{game.time}s</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl">{game.word}</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <GiStarsStack size={36} />
          <h1>{game.score}</h1>
        </div>
      </div>
    </div>
  );
};
export default DetailBar;
