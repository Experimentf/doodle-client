import { Fragment, HTMLAttributes } from 'react';

import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

import Doodler from './Doodler';

const DoodlerList = (props: HTMLAttributes<HTMLDivElement>) => {
  const { room } = useRoom();

  return (
    <div {...props}>
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col min-h-0">
        <h1 className="text-lg whitespace-nowrap text-ellipsis text-chalk-white">
          {texts.game.doodlers.sectionTitle} ({room.doodlers.length})
        </h1>
        <hr className="my-2 text-chalk-white" />
        <div className="py-3 flex flex-col gap-2 overflow-auto flex-1">
          {room.doodlers.map((doodler, index) => (
            <Fragment key={doodler.id}>
              <Doodler
                key={doodler.id}
                doodler={doodler}
                position={index}
                isDrawing={room.drawerId === doodler.id}
              />
              {index !== room.doodlers.length - 1 && (
                <hr className="mx-4 text-dark-chalk-white mt-2" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoodlerList;
