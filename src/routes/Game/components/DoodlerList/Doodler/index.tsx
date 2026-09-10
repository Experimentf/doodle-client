import { FaPencil } from 'react-icons/fa6';

import Avatar from '@/components/Avatar';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useUser } from '@/contexts/user';
import { DoodlerInterface } from '@/types/models/doodler';

interface DoodlerProps {
  doodler: DoodlerInterface;
  position: number;
  isDrawing: boolean;
}

const Doodler = ({ doodler, isDrawing }: DoodlerProps) => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-1 text-xs lg:text-sm">
      <div className="relative w-fit">
        <Avatar
          className="w-[75px] lg:min-w-[80px]"
          avatarProps={doodler.avatar}
        />
        {isDrawing && (
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-chalk-yellow border-2 border-card-surface-2">
            <FaPencil className="text-dark-board-green text-[0.6rem] lg:text-xs animate-bounce" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-1">
          <p className="text-light-chalk-white overflow-hidden text-ellipsis">
            {doodler.name}
          </p>
          {user.id === doodler.id && (
            <Text component={'span'} className="text-light-chalk-blue">
              {texts.game.doodlers.userMarker}
            </Text>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <Text className="text-[0.6rem] lg:text-xs">Points -</Text>
          <Text component="p" className="text-chalk-yellow text-xs lg:text-sm">
            {doodler.score}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default Doodler;
