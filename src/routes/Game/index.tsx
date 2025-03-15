import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loading from '@/components/Loading';
import Title from '@/components/Title';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';
import CanvasProvider from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSnackbar } from '@/contexts/snackbar';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';
import { ErrorFromServer } from '@/utils/error';

import DetailBar from './components/DetailBar';
import Doodlers from './components/DoodlerList';
import HunchList from './components/HunchList';
import InGame from './components/InGame';
import Lobby from './components/Lobby';
import Result from './components/Result';

const GameLayout = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { user } = useUser();
  const { registerEvent, asyncEmitEvent, isConnected } = useSocket();
  const { game, setGame } = useGame();
  const { setRoom } = useRoom();

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
    registerEvent(GameEvents.ON_GAME_STATUS_UPDATED, ({ room, game }) => {
      setRoom((prev) => ({ ...room, doodlers: prev.doodlers }));
      if (game) setGame(game);
    });
  };

  const handleValidateUser = async () => {
    const data = await asyncEmitEvent(
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
    const { room: roomData, doodlers } = await asyncEmitEvent(
      RoomEvents.EMIT_GET_ROOM,
      roomId
    );
    if (roomData.id !== roomId) {
      throw new Error('Invalid Room ID!');
    }
    setRoom({
      ...roomData,
      doodlers,
    });
    return roomData;
  };

  const handleGetGame = async (gameId?: string) => {
    if (!gameId) return;
    const { game } = await asyncEmitEvent(GameEvents.EMIT_GET_GAME, gameId);
    setGame(game);
  };

  const handleSetup = async () => {
    try {
      await handleValidateUser();
      const roomData = await handleGetRoom();
      await handleGetGame(roomData.gameId);
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

  const gameComponent = useMemo(() => {
    switch (game.status) {
      case GameStatus.GAME:
        return (
          <CanvasProvider>
            <InGame />
          </CanvasProvider>
        );
      case GameStatus.LOBBY:
        return <Lobby />;
      case GameStatus.RESULT:
        return <Result />;
      default:
        return null;
    }
  }, [game.status]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <Title small />
      <DetailBar />
      <div className="flex flex-grow gap-4">
        <Doodlers />
        <div className="flex-grow">{gameComponent}</div>
        <HunchList />
      </div>
    </div>
  );
};

export default GameLayout;
