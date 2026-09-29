import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCrown, FaPencil, FaUsers, FaXmark } from 'react-icons/fa6';

import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import useMediaQuery from '@/hooks/useMediaQuery';
import { GameStatus } from '@/types/models/game';
import { getDoodlerById } from '@/utils/game';
import { CROWN_COLORS, getCrownRank, getDenseRank } from '@/utils/rank';

import DoodlerList from '../DoodlerList';

interface PlayerPanelProps {
  // Two lines instead of a card, for the narrow side column on short landscape screens.
  dense?: boolean;
  className?: string;
}

// Compact layout: the player's own standing and the current drawer; the full list is in a sheet.
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
  const isTurn = game.status === GameStatus.GAME;
  const rank = me ? getDenseRank(room.doodlers, me.score) : undefined;
  const crownRank = me ? getCrownRank(room.doodlers, me.score) : undefined;

  useEffect(() => {
    if (!isSheetOpen) return;
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setIsSheetOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

  // Own status as a label rather than icons that come and go, so the panel never changes shape.
  const status = !isTurn
    ? undefined
    : isMeDrawing
    ? {
        text: t.status.drawing,
        className: 'bg-chalk-yellow text-dark-board-green',
      }
    : hunchedIds.has(user.id)
    ? {
        text: t.status.hunched,
        className: 'bg-chalk-green text-dark-board-green',
      }
    : {
        text: t.status.hunching,
        className: 'bg-dark-board-green text-chalk-white',
      };

  const rankLabel = `${t.rankTitle} #${rank ?? '-'}/${room.doodlers.length}`;
  const title = (
    <span className="flex items-center gap-1.5 min-w-0">
      <span
        className="whitespace-nowrap text-chalk-white"
        title={rankLabel}
        aria-label={rankLabel}
      >
        {/* Same crown the avatars wear in the full list, perched on the # like a hat. */}
        <span className="relative inline-block">
          {crownRank !== undefined && (
            <FaCrown
              aria-hidden="true"
              className="absolute -top-1.5 -left-1 text-[0.6rem] -rotate-[25deg] drop-shadow"
              style={{ color: CROWN_COLORS[crownRank] }}
            />
          )}
          #
        </span>
        {rank ?? '-'}
        <span className="text-light-chalk-white">/{room.doodlers.length}</span>
      </span>
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

  // Icon + count so it fits next to the title even in the narrow phone card.
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
              {title}
              <span className="whitespace-nowrap">
                {pointsValue}{' '}
                <span className="text-light-chalk-white">{t.points}</span>
              </span>
            </div>
            <div className="flex items-center min-w-0">{drawingValue}</div>
          </div>
          {showAll}
        </div>
      ) : (
        // Every row is always present so roles don't reflow it.
        <div
          className={`min-h-0 flex flex-col gap-2 p-2 bg-card-surface-2 rounded-lg text-xs overflow-y-auto ${className}`}
        >
          <div className="flex items-center justify-between gap-2">
            {title}
            {showAll}
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5">
            <dt className="text-light-chalk-white">{t.labels.points}</dt>
            <dd className="text-right">{pointsValue}</dd>
            <dt className="text-light-chalk-white">{t.labels.drawing}</dt>
            <dd className="min-w-0">{drawingValue}</dd>
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
