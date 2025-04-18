import {
  ChangeEvent,
  FormEventHandler,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import { DoodlerEvents, RoomEvents } from '@/constants/Events';
import { LocalStorageKeys } from '@/constants/LocalStorage';
import texts from '@/constants/texts';
import { useSnackbar } from '@/contexts/snackbar';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { getRandomAvatarProps } from '@/utils/avatar';
import { ErrorFromServer } from '@/utils/error';

interface PlayFormProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
}

const PlayForm = ({ roomId, ...props }: PlayFormProps) => {
  const { user, updateUser } = useUser();
  const { socketConnectionState, asyncEmitEvent } = useSocket();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<
    Pick<typeof user, 'name' | 'avatar'>
  >({
    name: user.name,
    avatar: user.avatar,
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

  const handleSetUser = async () => {
    if (!validate()) return false;
    updateUser('name', userInfo.name);
    updateUser('avatar', userInfo.avatar);
    localStorage.setItem(LocalStorageKeys.USER_NAME, userInfo.name);
    const data = await asyncEmitEvent(DoodlerEvents.EMIT_SET_DOODLER, userInfo);
    return !!data;
  };

  // Join a Public Room
  const handleJoinPublicRoom = async () => {
    const data = await asyncEmitEvent(
      RoomEvents.EMIT_ADD_DOODLER_TO_PUBLIC_ROOM,
      undefined
    );
    navigate(`/${data.roomId}`);
  };

  // Join a Private Room
  const handleJoinPrivateRoom = async () => {
    if (!roomId) return;
    try {
      const { room } = await asyncEmitEvent(
        RoomEvents.EMIT_ADD_DOODLER_TO_PRIVATE_ROOM,
        { roomId }
      );
      navigate(`/${room.id}`);
    } catch (e) {
      if (e instanceof ErrorFromServer) {
        openSnackbar({ message: e.message, color: 'error' });
      }
      navigate('/');
    }
  };

  const handlePlay: FormEventHandler = async (e) => {
    try {
      e.preventDefault();
      const isSetUser = await handleSetUser();
      if (!isSetUser) return;
      if (roomId) handleJoinPrivateRoom();
      else handleJoinPublicRoom();
    } catch (e) {
      if (e instanceof ErrorFromServer) {
        openSnackbar({ message: e.message, color: 'error' });
      }
    }
  };

  const handleCreatePrivateRoom: FormEventHandler = async (e) => {
    try {
      e.preventDefault();

      const isSetUser = await handleSetUser();
      if (!isSetUser) return;
      const data = await asyncEmitEvent(
        RoomEvents.EMIT_CREATE_PRIVATE_ROOM,
        undefined
      );
      navigate(`/${data.roomId}`);
    } catch (e) {
      if (e instanceof ErrorFromServer) {
        openSnackbar({ message: e.message, color: 'error' });
      }
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, name: e.target.value.trim() }));
  };

  const handleRandomizeAvatar = () => {
    setUserInfo((prev) => ({ ...prev, avatar: getRandomAvatarProps() }));
  };

  useEffect(() => {
    const storedName = localStorage.getItem(LocalStorageKeys.USER_NAME);
    if (storedName) setUserInfo((prev) => ({ ...prev, name: storedName }));
  }, []);

  const isDisabled = [
    SocketConnectionState.CONNECTING,
    SocketConnectionState.RECONNECTING,
    SocketConnectionState.ERROR,
  ].includes(socketConnectionState);

  return (
    <div {...props}>
      <form className="p-8 rounded-xl flex flex-col gap-8" noValidate>
        <div className="relative">
          <div className="absolute right-0 bottom-0">
            <IconButton
              variant="primary"
              color="warning"
              className="text-2xl"
              onClick={handleRandomizeAvatar}
              type="button"
              tooltip="Randomize"
              icon={<GiPerspectiveDiceSixFacesRandom />}
            />
          </div>
          <Avatar className="mb-8" avatarProps={userInfo.avatar} />
        </div>
        <input
          autoFocus
          type="text"
          placeholder={texts.home.form.input.name.placeholder}
          className="w-100 transition-colors bg-transparent border-chalk-green border-b-4 placeholder-light-chalk-white p-2 outline-none text-center text-chalk-white invalid:border-chalk-white"
          value={userInfo.name}
          required
          onChange={handleNameChange}
        />
        <Button
          disabled={isDisabled}
          variant="secondary"
          color="success"
          type="submit"
          onClick={handlePlay}
        >
          {texts.home.form.buttons.playPublicGame}
        </Button>
        <Button
          disabled={isDisabled}
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
