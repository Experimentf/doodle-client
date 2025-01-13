import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { AvatarProps } from '@bigheads/core';
import Button from '../../../../components/Button/Button';
import { UserContext } from '../../../../contexts/UserContext';
import { SocketContext } from '../../../../contexts/SocketContext';
import { Events } from '../../../../constants/Events';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import CustomizableAvatar from '../../../../components/Avatar/Avatar';
import { getRandomAvatarProps } from '../../../../utils/avatar';
import IconButton from '../../../../components/Button/IconButton';

interface UserFormProps extends React.HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
}

const UserForm = ({ roomId, ...props }: UserFormProps) => {
  const navigate = useNavigate();
  const { name, updateName, saveName } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const { open: openSnackbar } = useContext(SnackbarContext);
  const [avatarProps, setAvatarProps] = useState<AvatarProps>(
    getRandomAvatarProps()
  );

  const validate = () => {
    if (!name) {
      openSnackbar({ message: 'Please enter your name', color: 'error' });
      return false;
    }
    return true;
  };

  const setup = () => {
    if (!validate()) return;
    saveName(name);
    socket.connect();
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
    setAvatarProps(getRandomAvatarProps());
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
            <CustomizableAvatar className="mb-8" avatarProps={avatarProps} />
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
            placeholder="Type your name"
            className="bg-transparent border-chalk-white border-b-4 placeholder-light-chalk-white p-2 outline-none text-center text-chalk-white invalid:border-chalk-pink"
            value={name}
            required
            onChange={handleNameChange}
          />
        </div>
        <Button variant="secondary" color="success" onClick={handlePlay}>
          Play!
        </Button>
        <Button
          variant="secondary"
          color="secondary"
          onClick={handleCreatePrivateRoom}
        >
          Create private room
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
