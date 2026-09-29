import { Fragment, HTMLAttributes, useEffect, useRef } from 'react';

import texts from '@/constants/texts';
import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { getCrownRank } from '@/utils/rank';

import Doodler from './Doodler';

interface DoodlerListProps extends HTMLAttributes<HTMLDivElement> {
  // Inside a Sheet: the sheet is the surface and shows the title, so no card shadow or own header.
  embedded?: boolean;
}

const DoodlerList = ({ embedded = false, ...props }: DoodlerListProps) => {
  const { room } = useRoom();
  const { hunchedIds, highlight } = useHunches();
  const listRef = useRef<HTMLDivElement>(null);

  // Also runs on mount, so a list inside a just-opened sheet scrolls to the highlighted doodler.
  useEffect(() => {
    if (!highlight) return;
    listRef.current
      ?.querySelector(`[data-doodler-id="${CSS.escape(highlight.id)}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlight?.nonce]);

  return (
    <div {...props}>
      <div
        className={`bg-card-surface-2 rounded-lg flex flex-col min-h-0 ${
          embedded ? '' : 'p-2 lg:p-4 shadowed'
        }`}
      >
        {!embedded && (
          <>
            <h1 className="text-lg whitespace-nowrap text-ellipsis text-chalk-white">
              {texts.game.doodlers.sectionTitle} ({room.doodlers.length})
            </h1>
            <hr className="my-2 text-chalk-white" />
          </>
        )}
        <div
          ref={listRef}
          className="lg:py-3 flex flex-col gap-1 lg:gap-2 overflow-auto flex-1"
        >
          {room.doodlers.map((doodler, index) => (
            <Fragment key={doodler.id}>
              <Doodler
                key={doodler.id}
                doodler={doodler}
                position={index}
                isDrawing={room.drawerId === doodler.id}
                crownRank={getCrownRank(room.doodlers, doodler.score)}
                hunched={hunchedIds.has(doodler.id)}
                highlightNonce={
                  highlight?.id === doodler.id ? highlight.nonce : undefined
                }
              />
              {index !== room.doodlers.length - 1 && (
                <hr className="mx-4 text-dark-chalk-white lg:mt-2" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoodlerList;
