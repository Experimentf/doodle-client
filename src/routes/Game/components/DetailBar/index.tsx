import { FaArrowRotateRight } from 'react-icons/fa6';
import { GiAlarmClock } from 'react-icons/gi';

import { useGame } from '@/contexts/game';

const DetailBar = () => {
  const { game } = useGame();

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-4 bg-card-surface-2 rounded-lg w-full">
        <div className="flex flex-row items-center gap-2">
          <GiAlarmClock size={36} />
          <h1>{game.options.time.current}s</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl">{game.options.word}</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <FaArrowRotateRight size={28} />
          <h1>
            {game.options.round.current} / {game.options.round.max}
          </h1>
        </div>
      </div>
    </div>
  );
};
export default DetailBar;
