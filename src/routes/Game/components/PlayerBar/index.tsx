import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaPencil, FaUsers, FaXmark } from 'react-icons/fa6';

import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getDoodlerById } from '@/utils/game';

import DoodlerList from '../DoodlerList';

// Compact layout: only the player's own standing inline; everyone else lives in a sheet.
const PlayerBar = () => {
  const { room } = useRoom();
  const { user } = useUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isLandscape = useMediaQuery('(orientation: landscape)');

  const me = getDoodlerById(room.doodlers, user.id);
  const drawer = getDoodlerById(room.doodlers, room.drawerId);
  // Dense rank, matching DoodlerList's crowns: tied scores share a place.
  const distinctScores = [
    ...new Set(room.doodlers.map(({ score }) => score)),
  ].sort((a, b) => b - a);
  const rank = me ? distinctScores.indexOf(me.score) + 1 : undefined;
  const { doodlers: t } = texts.game;

  useEffect(() => {
    if (!isSheetOpen) return;
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setIsSheetOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

  const offscreen = isLandscape ? { x: '100%' } : { y: '100%' };

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-card-surface-2 rounded-lg text-xs sm:text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-1 text-light-chalk-blue">
            {t.you}
            {/* Icon only for yourself: "You're drawing" truncates to nothing in narrow side columns. */}
            {drawer?.id === user.id && (
              <FaPencil
                className="text-chalk-yellow"
                title={t.youAreDrawing}
                aria-label={t.youAreDrawing}
              />
            )}
          </span>
          {rank !== undefined && (
            <span className="text-chalk-white whitespace-nowrap">
              #{rank}
              <span className="text-light-chalk-white">
                /{room.doodlers.length}
              </span>
            </span>
          )}
          <span className="text-chalk-yellow whitespace-nowrap">
            {me?.score ?? 0} {t.points}
          </span>
          {drawer && drawer.id !== user.id && (
            <span className="flex items-center gap-1 min-w-0 text-light-chalk-white">
              <FaPencil className="shrink-0 text-chalk-yellow" />
              <span className="truncate">{`${drawer.name}${t.isDrawing}`}</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-white text-dark-board-green"
        >
          <FaUsers /> {t.showAll} ({room.doodlers.length})
        </button>
      </div>
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

export default PlayerBar;
