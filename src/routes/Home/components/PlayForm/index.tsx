import {
  ChangeEvent,
  FormEventHandler,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import { DoodlerEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import { useSnackbar } from '@/contexts/snackbar';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { getRandomAvatarProps } from '@/utils/avatar';

interface PlayFormProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
}

const PlayForm = ({ roomId, ...props }: PlayFormProps) => {
  const { user, updateUser } = useUser();
  const { isConnected, emitEvent } = useSocket();
  const [userInfo, setUserInfo] = useState({
    name: '',
    avatar: {},
  });
  const { openSnackbar } = useSnackbar();

  const validate = () => {
    if (!userInfo.name) {
      openSnackbar({
        message: texts.home.form.validation.error,
        color: 'error',
      });
      return false;
    }
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSetUser = (next?: () => void) => {
    if (!validate()) return;
    updateUser('name', userInfo.name);
    updateUser('avatar', userInfo.avatar);
    // TODO: MAKE IT PROMISE BASED
    emitEvent(DoodlerEvents.EMIT_SET_DOODLER, userInfo, ({ data, error }) => {
      if (error || !data) {
        openSnackbar({ message: 'Please try again!', color: 'error' });
        return;
      }
      next?.();
    });
  };

  // Join a Public Room
  const handleJoinPublicRoom = () => {
    // TODO: TELL SERVER TO ADD DOODLER TO PUBLIC ROOM
  };

  // Join a Private Room
  const handleJoinPrivateRoom = () => {
    // TODO: TELL SERVER TO ADD DOODLER TO PRIVATE ROOM
  };

  const handlePlay: FormEventHandler = (e) => {
    e.preventDefault();
    const nextHandler = roomId ? handleJoinPrivateRoom : handleJoinPublicRoom;
    handleSetUser(nextHandler);
  };

  const handleCreatePrivateRoom = () => {
    handleSetUser();
    // TODO: TELL SERVER TO CREATE A PRIVATE ROOM
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleRandomizeAvatar = () => {
    setUserInfo((prev) => ({ ...prev, avatarProps: getRandomAvatarProps() }));
  };

  useEffect(() => {
    setUserInfo({ name: user.name, avatar: user.avatar });
  }, [user]);

  return (
    <div {...props}>
      <form
        className="p-8 rounded-xl flex flex-col gap-8"
        noValidate
        onSubmit={handlePlay}
      >
        <div>
          <div className="relative">
            <Avatar className="mb-8" avatarProps={userInfo.avatar} />
            <IconButton
              variant="primary"
              color="warning"
              className="absolute right-0 bottom-0 text-2xl"
              onClick={handleRandomizeAvatar}
              type="button"
            >
              <GiPerspectiveDiceSixFacesRandom />
            </IconButton>
          </div>
          <input
            autoFocus
            type="text"
            placeholder={texts.home.form.input.name.placeholder}
            className="bg-transparent border-chalk-white border-b-4 placeholder-light-chalk-white p-2 outline-none text-center text-chalk-white invalid:border-chalk-pink"
            value={userInfo.name}
            required
            onChange={handleNameChange}
          />
        </div>
        <Button
          disabled={!isConnected}
          variant="secondary"
          color="success"
          type="submit"
        >
          {texts.home.form.buttons.playPublicGame}
        </Button>
        <Button
          disabled={!isConnected}
          variant="secondary"
          color="secondary"
          onClick={handleCreatePrivateRoom}
        >
          {texts.home.form.buttons.createPrivateRoom}
        </Button>
      </form>
    </div>
  );
};

export default PlayForm;
