import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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

  const you = (
    <span className="flex items-center gap-1 text-light-chalk-blue">
      {t.you}
      {isMeDrawing && (
        <FaPencil
          className="text-chalk-yellow"
          title={t.youAreDrawing}
          aria-label={t.youAreDrawing}
        />
      )}
      {hunchedIds.has(user.id) && (
        <FaCheck
          className="text-chalk-green"
          title={t.youGuessed}
          aria-label={t.youGuessed}
        />
      )}
    </span>
  );
  const standing = (
    <>
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
    </>
  );
  const drawerInfo = drawer && !isMeDrawing && (
    <span className="flex items-center gap-1 min-w-0 text-light-chalk-white">
      <FaPencil className="shrink-0 text-chalk-yellow" />
      <span className="truncate">{drawer.name}</span>
    </span>
  );
  const guessedInfo = isTurn && (
    <span className="flex items-center gap-1 whitespace-nowrap text-chalk-green">
      <FaCheck className="shrink-0" />
      {guessedCount}/{guessers} {t.guessed}
    </span>
  );
  const showAll = (
    <button
      type="button"
      onClick={() => setIsSheetOpen(true)}
      aria-label={`${t.showAll} (${room.doodlers.length})`}
      className="shrink-0 flex items-center justify-center gap-1 px-2 py-1 rounded-full bg-white text-dark-board-green"
    >
      <FaUsers />
      {dense ? room.doodlers.length : `${t.showAll} (${room.doodlers.length})`}
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
              {standing}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              {drawerInfo}
              {guessedInfo}
            </div>
          </div>
          {showAll}
        </div>
      ) : (
        <div
          // self-start: a grid item would otherwise stretch to the full row height.
          className={`self-start flex flex-col gap-1.5 p-2 bg-card-surface-2 rounded-lg text-xs overflow-hidden ${className}`}
        >
          <div className="flex items-center justify-between gap-2">
            {you}
            {standing}
          </div>
          {drawerInfo}
          {guessedInfo}
          <div className="pt-1">{showAll}</div>
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
