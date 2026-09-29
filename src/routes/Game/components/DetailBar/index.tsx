import { useEffect, useState } from 'react';
import { GiAlarmClock } from 'react-icons/gi';

import Text from '@/components/Text';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import { GameOptions, GameStatus } from '@/types/models/game';

const TICK_MS = 250;

const timerKeys: Partial<Record<GameStatus, keyof GameOptions['timers']>> = {
  [GameStatus.GAME]: 'drawing',
  [GameStatus.TURN_END]: 'turnEndCooldownTime',
  [GameStatus.CHOOSE_WORD]: 'chooseWordTime',
  [GameStatus.ROUND_START]: 'roundStartCooldownTime',
  [GameStatus.RESULT]: 'resultCooldownTime',
};

const DetailBar = () => {
  const { game } = useGame();
  const { room } = useRoom();
  const { user } = useUser();
  // performance.now() based; derived from the server's timeLeft rather than counted down tick by tick,
  // because background tabs throttle timers and missed ticks would never be subtracted.
  const [deadline, setDeadline] = useState<number>();
  const [now, setNow] = useState(() => performance.now());
  const shouldDisplay =
    game.status === GameStatus.GAME ||
    (game.status === GameStatus.CHOOSE_WORD && user.id === room.drawerId);

  // Every game object is a fresh server snapshot, so re-anchor on each one.
  useEffect(() => {
    const key = timerKeys[game.status];
    if (!key) {
      setDeadline(undefined);
      return;
    }
    const timeLeft = game.timeLeft ?? game.options.timers[key].max * 1000;
    setDeadline(performance.now() + timeLeft);
  }, [game]);

  useEffect(() => {
    if (deadline === undefined) return;
    const tick = () => setNow(performance.now());
    tick();
    const interval = setInterval(tick, TICK_MS);
    // Correct immediately when a throttled background tab becomes visible again.
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [deadline]);

  const currentTime =
    deadline === undefined
      ? 0
      : Math.max(0, Math.ceil((deadline - now) / 1000));

  return (
    <div className="w-full text-xs lg:text-base">
      <div className="flex flex-row items-center justify-between p-2 lg:p-4 bg-card-surface-2 rounded-lg w-full">
        <div
          className={`flex flex-row items-center gap-2 ${
            shouldDisplay && currentTime <= 10 ? 'text-chalk-pink' : ''
          }`}
        >
          <GiAlarmClock
            className={`text-2xl lg:text-3xl ${
              shouldDisplay && currentTime <= 10 ? 'animate-alarm-wiggle' : ''
            }`}
          />
          <h1>{shouldDisplay ? currentTime : 0}s</h1>
        </div>
        <h1 className="text-lg lg:text-2xl flex gap-2">
          {game.options.word.split('').map((ch, index) => (
            <span key={index}>{ch}</span>
          ))}
        </h1>
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
