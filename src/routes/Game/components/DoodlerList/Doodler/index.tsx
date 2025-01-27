import Avatar from '@/components/Avatar';
import texts from '@/constants/texts';
import { useUser } from '@/contexts/user';
import { DoodlerInterface } from '@/types/models/doodler';

interface DoodlerProps {
  doodler: DoodlerInterface;
  position: number;
}

const Doodler = ({ doodler, position }: DoodlerProps) => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-1">
      <h1>{position + 1}.</h1>
      <Avatar className="min-w-[80px] w-20" avatarProps={doodler.avatar} />
      <p className="text-light-chalk-white overflow-hidden text-ellipsis">
        {doodler.name}
      </p>
      {user.id === doodler.id && (
        <span className="text-light-chalk-blue">
          {texts.game.doodlers.userMarker}
        </span>
      )}
    </div>
  );
};
export default Doodler;
