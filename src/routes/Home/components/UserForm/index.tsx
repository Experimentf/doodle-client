import {
  ChangeEvent,
  FormEventHandler,
  HTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import texts from '@/constants/texts';
import { SnackbarContext } from '@/contexts/SnackbarContext';
import { useSocket } from '@/contexts/socket/useSocket';
import { useUser } from '@/contexts/user/useUser';
import { getRandomAvatarProps } from '@/utils/avatar';

interface UserFormProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
}

const UserForm = ({ roomId, ...props }: UserFormProps) => {
  const { user, updateUser } = useUser();
  const { isConnected } = useSocket();
  const [userInfo, setUserInfo] = useState({
    name: '',
    avatarProps: {},
  });
  const { open: openSnackbar } = useContext(SnackbarContext);

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

  const handleSetUser = () => {
    if (!validate()) return;
    updateUser('name', userInfo.name);
    updateUser('avatarProps', userInfo.avatarProps);
    // TODO: TELL SERVER TO SET DOODLER INFO
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
    handleSetUser();
    if (!roomId) handleJoinPublicRoom();
    else handleJoinPrivateRoom();
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
    setUserInfo({ name: user.name, avatarProps: user.avatarProps });
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
            <Avatar className="mb-8" avatarProps={userInfo.avatarProps} />
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

export default UserForm;
