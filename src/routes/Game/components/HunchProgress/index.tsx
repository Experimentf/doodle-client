import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa6';

import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';

// Hex, not Tailwind classes: framer-motion animates colour values.
const CALM_COLOR = '#a4d8b2'; // chalk-green
const NEUTRAL_COLOR = '#c2c2c2'; // chalk-white
const URGENCY = {
  // Half the other hunchers are in and you aren't: a slow orange fade for a nudge.
  warning: { color: '#ffa94d', duration: 1.6, threshold: 0.5 },
  // Most are in: a fast chalk-pink fade to get real attention.
  critical: { color: '#ff5e5e', duration: 0.6, threshold: 0.8 },
};

interface HunchProgressProps {
  className?: string;
}

// Room-wide "n/m hunched the word", kept apart from the player's own stats so it
// doesn't read as a personal tally. Always rendered ("-" between turns) to avoid layout shift.
const HunchProgress = ({ className = '' }: HunchProgressProps) => {
  const { room } = useRoom();
  const { user } = useUser();
  const { game } = useGame();
  const { hunchedIds } = useHunches();
  const reduceMotion = useReducedMotion();

  const isTurn = game.status === GameStatus.GAME;
  const isMeDrawing = !!room.drawerId && room.drawerId === user.id;
  const hasHunched = hunchedIds.has(user.id);
  const hunchers = Math.max(0, room.doodlers.length - (room.drawerId ? 1 : 0));
  const hunchedCount = room.doodlers.filter(({ id }) =>
    hunchedIds.has(id)
  ).length;

  // Share of the *other* hunchers who are in, so being the last one left is always 100%.
  const otherHunchers = hunchers - 1;
  const ratio = otherHunchers > 0 ? hunchedCount / otherHunchers : 0;
  const isBehind = isTurn && !isMeDrawing && !hasHunched && hunchedCount > 0;
  const urgency = !isBehind
    ? undefined
    : ratio >= URGENCY.critical.threshold
    ? URGENCY.critical
    : ratio >= URGENCY.warning.threshold
    ? URGENCY.warning
    : undefined;
  // Green only when more hunches are good news for you.
  const baseColor = isMeDrawing || hasHunched ? CALM_COLOR : NEUTRAL_COLOR;

  // Pop only when someone new hunches - not on the reset to 0 at turn start or on first render.
  const popControls = useAnimationControls();
  const prevCountRef = useRef(hunchedCount);
  useEffect(() => {
    if (hunchedCount > prevCountRef.current)
      popControls.start({
        scale: [1, 1.4, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      });
    prevCountRef.current = hunchedCount;
  }, [hunchedCount]);

  return (
    <div
      className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/20 text-xs text-light-chalk-white ${className}`}
    >
      {/* Outer span pops on a new hunch; inner span carries the urgency colour pulse. */}
      <motion.span animate={popControls} className="inline-flex">
        <motion.span
          animate={
            urgency && !reduceMotion
              ? { color: [baseColor, urgency.color, baseColor] }
              : { color: urgency?.color ?? baseColor }
          }
          transition={
            urgency && !reduceMotion
              ? {
                  duration: urgency.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
          className={`flex items-center gap-1 whitespace-nowrap ${
            urgency ? 'font-bold' : ''
          }`}
        >
          <FaCheck className="shrink-0" />
          {isTurn ? `${hunchedCount}/${hunchers}` : '-'}
        </motion.span>
      </motion.span>
      <span className="truncate">{texts.game.hunchProgress.suffix}</span>
    </div>
  );
};

export default HunchProgress;
