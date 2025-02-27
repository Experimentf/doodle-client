import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';

import Doodler from './Doodler';

const DoodlerList = () => {
  const { room } = useRoom();

  return (
    <div className="w-[18rem]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed">
        <h1 className="text-lg whitespace-nowrap text-ellipsis text-chalk-white">
          {texts.game.doodlers.sectionTitle} ({room.doodlers.length})
        </h1>
        <hr className="my-2 text-chalk-white" />
        <div className="mt-2">
          {room.doodlers.map((doodler, index) => (
            <Doodler
              key={doodler.id}
              doodler={doodler}
              position={index}
              isDrawing={room.drawerId === doodler.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoodlerList;
