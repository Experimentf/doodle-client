import {
  ChangeEvent,
  FormEventHandler,
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { DoodlerEvents, RoomEvents } from '@/constants/Events';
import { LocalStorageKeys } from '@/constants/LocalStorage';
import texts from '@/constants/texts';
import { useSnackbar } from '@/contexts/snackbar';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { getSeededAvatar } from '@/utils/avatar';
import { ErrorFromServer } from '@/utils/error';
import { generateUsername } from '@/utils/username';

interface PlayFormProps extends HTMLAttributes<HTMLDivElement> {
  roomId: string | null;
  // The player tried to play but the server is unreachable.
  onConnectionError?: () => void;
}

type PendingAction = 'public' | 'private' | null;

const PlayForm = ({ roomId, onConnectionError, ...props }: PlayFormProps) => {
  const { user, updateUser } = useUser();
  const { socketConnectionState, asyncEmitEvent } = useSocket();
  const navigate = useNavigate();
  // First visit gets a generated name, so the field and seeded avatar aren't blank.
  const [name, setName] = useState(
    () =>
      user.name ||
      localStorage.getItem(LocalStorageKeys.USER_NAME) ||
      generateUsername()
  );
  const avatar = useMemo(
    () => getSeededAvatar(user.id + name),
    [user.id, name]
  );
  // The seed includes the socket id, which only exists once connected - wait for it
  // so the avatar draws once instead of redrawing when the id arrives. If the server
  // is unreachable, fall back to the name alone rather than an empty spot.
  const isAvatarReady =
    !!user.id || socketConnectionState === SocketConnectionState.ERROR;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { openSnackbar } = useSnackbar();

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

  const handleSetUser = async () => {
    if (!validate()) return false;
    updateUser('name', name);
    updateUser('avatar', avatar);
    localStorage.setItem(LocalStorageKeys.USER_NAME, name);
    const data = await asyncEmitEvent(DoodlerEvents.EMIT_SET_DOODLER, {
      name,
      avatar,
    });
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

  const performPlay = async () => {
    try {
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

  const performCreatePrivateRoom = async () => {
    try {
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

  // Always set pendingAction so the buttons disable immediately, even when already connected - prevents double-submit on a fast second click.
  const handlePlay: FormEventHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (socketConnectionState === SocketConnectionState.ERROR) {
      onConnectionError?.();
      return;
    }
    setPendingAction('public');
    if (socketConnectionState === SocketConnectionState.CONNECTED) {
      performPlay().finally(() => setPendingAction(null));
    }
  };

  const handleCreatePrivateRoom: FormEventHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (socketConnectionState === SocketConnectionState.ERROR) {
      onConnectionError?.();
      return;
    }
    setPendingAction('private');
    if (socketConnectionState === SocketConnectionState.CONNECTED) {
      performCreatePrivateRoom().finally(() => setPendingAction(null));
    }
  };

  useEffect(() => {
    if (socketConnectionState === SocketConnectionState.ERROR) {
      // A Play/Create click was waiting for the connection that just failed.
      if (pendingAction) onConnectionError?.();
      setPendingAction(null);
      return;
    }
    if (socketConnectionState !== SocketConnectionState.CONNECTED) return;
    if (pendingAction === 'public') {
      performPlay().finally(() => setPendingAction(null));
    } else if (pendingAction === 'private') {
      performCreatePrivateRoom().finally(() => setPendingAction(null));
    }
    // Keyed only on the connection transition - including pendingAction would re-fire this on the setPendingAction call above, double-invoking the action.
  }, [socketConnectionState]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };

  return (
    <div {...props}>
      <form className="p-4 rounded-xl flex flex-col gap-4" noValidate>
        <div className="relative w-44 mx-auto">
          {isAvatarReady ? (
            <Avatar avatar={avatar} animate pokeable drawIn />
          ) : (
            <div
              aria-hidden="true"
              className="w-full aspect-square rounded-full bg-chalk-white/5 animate-pulse"
            />
          )}
        </div>
        <input
          autoFocus
          type="text"
          placeholder={texts.home.form.input.name.placeholder}
          className="w-100 transition-colors bg-transparent border-chalk-green border-b-4 placeholder-light-chalk-white p-2 outline-none text-center text-chalk-white invalid:border-chalk-white"
          value={name}
          required
          onChange={handleNameChange}
        />
        <Button
          variant="secondary"
          color="success"
          type="submit"
          loading={pendingAction === 'public'}
          disabled={!!pendingAction}
          onClick={handlePlay}
        >
          {texts.home.form.buttons.playPublicGame}
        </Button>
        <Button
          variant="secondary"
          color="secondary"
          loading={pendingAction === 'private'}
          disabled={!!pendingAction}
          onClick={handleCreatePrivateRoom}
        >
          {texts.home.form.buttons.createPrivateRoom}
        </Button>
      </form>
    </div>
  );
};

export default PlayForm;
