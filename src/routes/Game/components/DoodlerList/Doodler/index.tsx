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
    <div className="flex items-center gap-1">
      <Avatar className="min-w-[80px]" avatarProps={doodler.avatar} />
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
          <Text
            component={'span'}
            color="secondary"
            className={`${isDrawing ? 'opacity-100' : 'opacity-0'} ml-2`}
          >
            <FaPencil className="animate-bounce" />
          </Text>
        </div>
        <div className="flex gap-1 items-center">
          <Text className="text-xs">Points -</Text>
          <Text component="p" className="text-chalk-yellow text-sm">
            {doodler.score}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default Doodler;
