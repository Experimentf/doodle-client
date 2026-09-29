import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaPencil, FaUsers, FaXmark } from 'react-icons/fa6';

import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import useMediaQuery from '@/hooks/useMediaQuery';
import { GameStatus } from '@/types/models/game';
import { getDoodlerById } from '@/utils/game';

import DoodlerList from '../DoodlerList';

// Hex, not Tailwind classes: framer-motion animates colour values.
const CALM_COLOR = '#a4d8b2'; // chalk-green
const NEUTRAL_COLOR = '#c2c2c2'; // chalk-white
const URGENCY = {
  // Half the guessers are in and you aren't: a slow orange fade for a nudge.
  warning: { color: '#ffa94d', duration: 1.6, threshold: 0.5 },
  // Most are in: a fast chalk-pink fade to get real attention.
  critical: { color: '#ff5e5e', duration: 0.6, threshold: 0.8 },
};

interface PlayerPanelProps {
  // Two lines instead of a card, for the narrow side column on short landscape screens.
  dense?: boolean;
  className?: string;
}

// Compact layout: just the player's own standing, the drawer and the guessed count; the full list is in a sheet.
const PlayerPanel = ({ dense = false, className = '' }: PlayerPanelProps) => {
  const { room } = useRoom();
  const { user } = useUser();
  const { game } = useGame();
  const { hunchedIds } = useHunches();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const { doodlers: t } = texts.game;

  const me = getDoodlerById(room.doodlers, user.id);
  const drawer = getDoodlerById(room.doodlers, room.drawerId);
  const isMeDrawing = drawer?.id === user.id;
  // Dense rank, matching DoodlerList's crowns: tied scores share a place.
  const distinctScores = [
    ...new Set(room.doodlers.map(({ score }) => score)),
  ].sort((a, b) => b - a);
  const rank = me ? distinctScores.indexOf(me.score) + 1 : undefined;
  const isTurn = game.status === GameStatus.GAME;
  const guessers = Math.max(0, room.doodlers.length - (drawer ? 1 : 0));
  const guessedCount = room.doodlers.filter(({ id }) =>
    hunchedIds.has(id)
  ).length;

  useEffect(() => {
    if (!isSheetOpen) return;
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setIsSheetOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

  const hasHunched = hunchedIds.has(user.id);
  // Pressure only for a guesser who hasn't hunched while others already have.
  const isBehind = isTurn && !isMeDrawing && !hasHunched && guessedCount > 0;
  // Share of the *other* guessers who are in, so being the last one left is always 100% (critical) even in small rooms.
  const otherGuessers = guessers - 1;
  const guessedRatio = otherGuessers > 0 ? guessedCount / otherGuessers : 0;
  const urgency = !isBehind
    ? undefined
    : guessedRatio >= URGENCY.critical.threshold
    ? URGENCY.critical
    : guessedRatio >= URGENCY.warning.threshold
    ? URGENCY.warning
    : undefined;
  // Green only when more hunches are good news for you; a guesser still guessing starts neutral.
  const baseColor = isMeDrawing || hasHunched ? CALM_COLOR : NEUTRAL_COLOR;
  const reduceMotion = useReducedMotion();

  // Pop only when someone new hunches - not on the reset to 0 at turn start or on first render.
  const guessedControls = useAnimationControls();
  const prevGuessedRef = useRef(guessedCount);
  useEffect(() => {
    if (guessedCount > prevGuessedRef.current)
      guessedControls.start({
        scale: [1, 1.4, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      });
    prevGuessedRef.current = guessedCount;
  }, [guessedCount]);
  // Own status as a label rather than icons that come and go, so the panel never changes shape.
  const status = !isTurn
    ? undefined
    : isMeDrawing
    ? {
        text: t.status.drawing,
        className: 'bg-chalk-yellow text-dark-board-green',
      }
    : hasHunched
    ? {
        text: t.status.guessed,
        className: 'bg-chalk-green text-dark-board-green',
      }
    : {
        text: t.status.guessing,
        className: 'bg-dark-board-green text-chalk-white',
      };

  const you = (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="text-light-chalk-blue">{t.you}</span>
      {status && (
        <span
          className={`px-1.5 rounded-full text-[0.65rem] leading-4 whitespace-nowrap ${status.className}`}
        >
          {status.text}
        </span>
      )}
    </span>
  );
  const rankValue = (
    <span className="text-chalk-white whitespace-nowrap">
      #{rank ?? '-'}
      <span className="text-light-chalk-white">/{room.doodlers.length}</span>
    </span>
  );
  const pointsValue = (
    <span className="text-chalk-yellow whitespace-nowrap">
      {me?.score ?? 0}
    </span>
  );
  const drawingValue = (
    <span className="flex items-center justify-end gap-1 min-w-0 text-chalk-white">
      <FaPencil className="shrink-0 text-chalk-yellow" />
      <span className="truncate">
        {isMeDrawing ? t.you : drawer?.name ?? '-'}
      </span>
    </span>
  );
  const guessedValue = (
    // Outer span pops on a new hunch; inner span carries the urgency colour pulse.
    <motion.span
      animate={guessedControls}
      className="flex items-center justify-end whitespace-nowrap origin-right"
    >
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
        className={`flex items-center gap-1 ${urgency ? 'font-bold' : ''}`}
      >
        <FaCheck className="shrink-0" />
        {isTurn ? `${guessedCount}/${guessers}` : '-'}
      </motion.span>
    </motion.span>
  );

  // Icon + count so it fits next to "You" even in the narrow phone card.
  const showAll = (
    <button
      type="button"
      onClick={() => setIsSheetOpen(true)}
      aria-label={`${t.showAll} (${room.doodlers.length})`}
      title={`${t.showAll} (${room.doodlers.length})`}
      className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-dark-board-green"
    >
      <FaUsers />
      {room.doodlers.length}
    </button>
  );

  const offscreen = isLandscape ? { x: '100%' } : { y: '100%' };

  return (
    <>
      {dense ? (
        <div
          className={`flex items-center gap-2 px-2 py-1.5 bg-card-surface-2 rounded-lg text-xs ${className}`}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {you}
              {rankValue}
              <span className="whitespace-nowrap">
                {pointsValue}{' '}
                <span className="text-light-chalk-white">{t.points}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-0">
              {drawingValue}
              {guessedValue}
            </div>
          </div>
          {showAll}
        </div>
      ) : (
        // Fills its column (grid stretch); every row is always present so roles don't reflow it.
        <div
          className={`h-full min-h-0 flex flex-col gap-2 p-2 bg-card-surface-2 rounded-lg text-xs overflow-y-auto ${className}`}
        >
          <div className="flex items-center justify-between gap-2">
            {you}
            {showAll}
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5">
            <dt className="text-light-chalk-white">{t.labels.rank}</dt>
            <dd className="text-right">{rankValue}</dd>
            <dt className="text-light-chalk-white">{t.labels.points}</dt>
            <dd className="text-right">{pointsValue}</dd>
            <dt className="text-light-chalk-white">{t.labels.drawing}</dt>
            <dd className="min-w-0">{drawingValue}</dd>
            <dt className="text-light-chalk-white">{t.labels.guessed}</dt>
            <dd>{guessedValue}</dd>
          </dl>
        </div>
      )}
      <AnimatePresence>
        {isSheetOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSheetOpen(false)}
          />
        )}
        {isSheetOpen && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t.sectionTitle}
            className={`fixed z-50 overflow-y-auto bg-card-surface-2 shadow-lg p-2 ${
              isLandscape
                ? 'top-0 right-0 h-full w-80 max-w-[85vw] rounded-l-2xl'
                : 'bottom-0 inset-x-0 max-h-[75dvh] rounded-t-2xl'
            }`}
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsSheetOpen(false)}
              className="absolute top-3 right-3 z-10 p-1 text-chalk-white"
            >
              <FaXmark />
            </button>
            <DoodlerList className="flex flex-col" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlayerPanel;
