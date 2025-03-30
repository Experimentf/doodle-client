import { useEffect, useRef, useState } from 'react';
import { GiAlarmClock } from 'react-icons/gi';

import Text from '@/components/Text';
import { useGame } from '@/contexts/game';
import { GameOptions, GameStatus } from '@/types/models/game';

const DetailBar = () => {
  const { game } = useGame();
  const [key, setKey] = useState<keyof GameOptions['timers']>();
  const [currentTime, setCurrentTime] = useState(
    key ? game.options.timers[key].max : 0
  );
  const timerRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (game.status === GameStatus.GAME) {
      setKey('drawing');
    } else if (game.status === GameStatus.ROUND_END) {
      setKey('roundEndCooldownTime');
    } else if (game.status === GameStatus.CHOOSE_WORD) {
      setKey('chooseWordTime');
    } else {
      setKey(undefined);
    }
  }, [game.status]);

  const startTimer = () => {
    setCurrentTime(0);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, 1000);
  };

  const resetTimer = () => {
    setCurrentTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    resetTimer();
    let t: NodeJS.Timeout | undefined = undefined;
    if (key) {
      startTimer();
      t = setTimeout(resetTimer, game.options.timers[key].max * 1000);
    }
    return () => {
      clearTimeout(t);
    };
  }, [key]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-4 bg-card-surface-2 rounded-lg w-full">
        <div className="flex flex-row items-center gap-2">
          <GiAlarmClock size={36} />
          <h1>{currentTime}s</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl">{game.options.word}</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text>Round - </Text>
          <h1>
            {game.options.round.current} / {game.options.round.max}
          </h1>
        </div>
      </div>
    </div>
  );
};
export default DetailBar;
