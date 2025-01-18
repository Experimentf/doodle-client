import React, { ChangeEvent, FormEvent, useContext } from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import { Events } from '@/constants/Events';
import texts from '@/constants/texts';
import { SnackbarContext } from '@/contexts/SnackbarContext';
import { SocketContext } from '@/contexts/SocketContext';
import { UserContext } from '@/contexts/UserContext';
import { getRandomAvatarProps } from '@/utils/avatar';

interface UserFormProps extends React.HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
}

const UserForm = ({ roomId, ...props }: UserFormProps) => {
  const navigate = useNavigate();
  const { name, updateName, saveName, avatarProps, updateAvatarProps } =
    useContext(UserContext);
  const { socket, isSocketConnected } = useContext(SocketContext);
  const { open: openSnackbar } = useContext(SnackbarContext);

  const validate = () => {
    if (!name) {
      openSnackbar({
        message: texts.home.form.validation.error,
        color: 'error',
      });
      return false;
    }
    return true;
  };

  const setup = () => {
    if (!validate()) return;
    saveName(name);
    socket.emit(Events.SET_USER, { name, avatar: avatarProps });
  };

  const handlePlayPublicGame = () => {
    socket.emit(
      Events.PLAY_PUBLIC_GAME,
      (publicRoomId: string, error: Error) => {
        if (error) {
          openSnackbar({ message: error.message, color: 'error' });
          return;
        }
        navigate(`/${publicRoomId}`, { replace: true });
      }
    );
  };

  // Play Game in Private Room when coming through a link
  const handlePlayGame = () => {};

  // Play Game in Public Room directly
  const handlePlay = () => {
    setup();
    if (!roomId) handlePlayPublicGame();
    else handlePlayGame();
  };

  // Create a new room
  const handleCreatePrivateRoom = () => {
    setup();
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateName(e.target.value);
  };

  const handleRandomizeAvatar = () => {
    updateAvatarProps(getRandomAvatarProps());
  };

  return (
    <div {...props}>
      <form
        className="p-8 rounded-xl flex flex-col gap-8"
        noValidate
        onSubmit={handleFormSubmit}
      >
        <div>
          <div className="relative">
            <Avatar className="mb-8" avatarProps={avatarProps} />
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
            value={name}
            required
            onChange={handleNameChange}
          />
        </div>
        <Button
          disabled={!isSocketConnected}
          variant="secondary"
          color="success"
          onClick={handlePlay}
        >
          {texts.home.form.buttons.playPublicGame}
        </Button>
        <Button
          disabled={!isSocketConnected}
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
