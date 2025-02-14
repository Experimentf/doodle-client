import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loading from '@/components/Loading';
import Title from '@/components/Title';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';
import { useGame } from '@/contexts/game';
import CanvasProvider from '@/contexts/game/canvas';
import { useRoom } from '@/contexts/room';
import { useSnackbar } from '@/contexts/snackbar';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';
import { ErrorFromServer } from '@/utils/error';

import End from './components/CanvasMode/End';
import InGame from './components/CanvasMode/InGame';
import Lobby from './components/CanvasMode/Lobby';
import DetailBar from './components/DetailBar';
import Doodlers from './components/DoodlerList';
import HunchList from './components/HunchList';

const GameLayout = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { user } = useUser();
  const { registerEvent, emitEventAsync, isConnected } = useSocket();
  const { game, setGame } = useGame();
  const { room, setRoom } = useRoom();

  const { openSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);

  const returnToHomePage = () => {
    navigate('/', { replace: true });
  };

  const handleEventsRegistration = () => {
    // When a new doodler joins the room
    registerEvent(RoomEvents.ON_DOODLER_JOIN, ({ doodler }) => {
      setRoom((prev) => ({ ...prev, doodlers: [...prev.doodlers, doodler] }));
    });

    // When a doodler leaves the room
    registerEvent(RoomEvents.ON_DOODLER_LEAVE, ({ doodlerId }) => {
      setRoom((prev) => ({
        ...prev,
        doodlers: prev.doodlers.filter(({ id }) => id !== doodlerId),
      }));
    });

    // When a game starts
    registerEvent(GameEvents.ON_GAME_START, () => {
      // gameMethods.updateRoom('status', GameStatus.IN_GAME);
    });

    // When a game ends
    registerEvent(GameEvents.ON_GAME_END, () => {
      // gameMethods.updateRoom('status', GameStatus.END);
    });

    // When a game comes to lobby
    registerEvent(GameEvents.ON_GAME_LOBBY, () => {
      // gameMethods.updateRoom('status', GameStatus.LOBBY);
    });
  };

  const handleValidateUser = async () => {
    const data = await emitEventAsync(
      DoodlerEvents.EMIT_GET_DOODLER,
      undefined
    );
    if (data.id !== user.id) {
      throw new Error('Verification failed!');
    }
    handleEventsRegistration();
  };

  const handleGetRoom = async () => {
    if (!roomId) {
      throw new Error('Invalid Room ID!');
    }
    const { room, doodlers } = await emitEventAsync(
      RoomEvents.EMIT_GET_ROOM,
      roomId
    );
    if (room.id !== roomId) {
      throw new Error('Invalid Room ID!');
    }
    setRoom({
      ...room,
      doodlers,
    });
  };

  const handleGetGame = async () => {
    if (!room.gameId) return;
    const { game } = await emitEventAsync(
      GameEvents.EMIT_GET_GAME,
      room.gameId
    );
    setGame(game);
  };

  const handleSetup = async () => {
    try {
      await handleValidateUser();
      await handleGetRoom();
      await handleGetGame();
    } catch (e) {
      if (e instanceof ErrorFromServer || e instanceof Error) {
        openSnackbar({
          message: e.message,
          color: 'error',
          isInfinite: true,
        });
      }
      returnToHomePage();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      returnToHomePage();
      return;
    }
    handleSetup();
  }, [roomId, isConnected]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <Title small />
      <DetailBar />
      <div className="flex flex-grow gap-4">
        <Doodlers />
        <div className="flex-grow">
          <CanvasProvider>
            {game.status === GameStatus.GAME && <InGame />}
            {game.status === GameStatus.LOBBY && <Lobby />}
            {game.status === GameStatus.END && <End />}
          </CanvasProvider>
        </div>
        <HunchList />
      </div>
    </div>
  );
};

export default GameLayout;
