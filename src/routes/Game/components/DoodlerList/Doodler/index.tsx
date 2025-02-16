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

const Doodler = ({ doodler, position, isDrawing }: DoodlerProps) => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-1">
      <h1>{position + 1}.</h1>
      <Avatar className="min-w-[80px] w-20" avatarProps={doodler.avatar} />
      <div className="flex flex-col justify-between gap-1">
        <div className="flex items-center">
          <p className="text-light-chalk-white overflow-hidden text-ellipsis">
            {doodler.name}
          </p>
          {user.id === doodler.id && (
            <span className="text-light-chalk-blue">
              {texts.game.doodlers.userMarker}
            </span>
          )}
        </div>
        {isDrawing && (
          <Text color="secondary">
            <FaPencil className="animate-bounce" />
          </Text>
        )}
      </div>
    </div>
  );
};
export default Doodler;
