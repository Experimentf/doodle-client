import { useEffect, useRef, useState } from 'react';
import { GiAlarmClock } from 'react-icons/gi';

import Text from '@/components/Text';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import { GameOptions, GameStatus } from '@/types/models/game';

const DetailBar = () => {
  const { game } = useGame();
  const { room } = useRoom();
  const { user } = useUser();
  const [key, setKey] = useState<keyof GameOptions['timers']>();
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const shouldDisplay =
    game.status === GameStatus.GAME ||
    (game.status === GameStatus.CHOOSE_WORD && user.id === room.drawerId);

  useEffect(() => {
    if (game.status === GameStatus.GAME) {
      setKey('drawing');
    } else if (game.status === GameStatus.TURN_END) {
      setKey('turnEndCooldownTime');
    } else if (game.status === GameStatus.CHOOSE_WORD) {
      setKey('chooseWordTime');
    } else if (game.status === GameStatus.ROUND_START) {
      setKey('roundStartCooldownTime');
    } else if (game.status === GameStatus.RESULT) {
      setKey('resultCooldownTime');
    } else setKey(undefined);
  }, [game.status]);

  const startTimer = (key: keyof GameOptions['timers']) => {
    setCurrentTime(game.options.timers[key].max);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => prev - 1);
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
      startTimer(key);
      t = setTimeout(resetTimer, game.options.timers[key].max * 1000);
    }
    return () => {
      clearTimeout(t);
    };
  }, [key]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-4 bg-card-surface-2 rounded-lg w-full">
        <div
          className={`flex flex-row items-center gap-2 ${
            shouldDisplay && currentTime <= 10
              ? 'text-chalk-pink animate-bounce'
              : ''
          }`}
        >
          <GiAlarmClock size={36} />
          <h1>{shouldDisplay ? currentTime : 0}s</h1>
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
