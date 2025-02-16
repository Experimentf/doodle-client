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
      <Avatar className="min-w-[80px] w-20" avatarProps={doodler.avatar} />
      <p className="text-light-chalk-white overflow-hidden text-ellipsis">
        {doodler.name}
        {user.id === doodler.id && (
          <Text component={'span'} className="text-light-chalk-blue">
            {' '}
            {texts.game.doodlers.userMarker}
          </Text>
        )}
      </p>
      <Text
        component={'span'}
        color="secondary"
        className={`${isDrawing ? 'opacity-0' : 'opacity-100'} ml-2`}
      >
        <FaPencil className="animate-bounce" />
      </Text>
    </div>
  );
};
export default Doodler;
