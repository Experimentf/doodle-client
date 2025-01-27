import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loading from '@/components/Loading';
import Title from '@/components/Title';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';
import CanvasProvider from '@/contexts/game/CanvasContext';
import { GameContext } from '@/contexts/game/GameContext';
import { SnackbarContext } from '@/contexts/SnackbarContext';
import { useSocket } from '@/contexts/socket/useSocket';
import { GameStatus } from '@/types/game';

import End from './components/CanvasMode/End';
import InGame from './components/CanvasMode/InGame';
import Lobby from './components/CanvasMode/Lobby';
import DetailBar from './components/DetailBar';
import Doodlers from './components/Doodlers';
import HunchList from './components/HunchList';

const GameLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { registerEvent, emitEvent, isConnected } = useSocket();
  const { open: openSnackbar } = useContext(SnackbarContext);
  const { gameState, gameMethods } = useContext(GameContext);

  const returnToHomePage = () => navigate('/', { replace: true });

  const getGameDetails = () => {
    if (!roomId) return;
    // emitEvent(
    //   GameEvents.EMIT_GET_GAME_DETAILS,
    //   roomId,
    //   (data: Room, error: Error) => {
    //     if (error) {
    //       openSnackbar({ message: error.message, color: 'error' });
    //       returnToHomePage();
    //       return;
    //     }
    //     Object.keys(data).forEach((key) =>
    //       gameMethods.updateRoom(key as keyof Room, data[key as keyof Room])
    //     );
    //   }
    // );
  };

  const handleEvents = () => {
    // When a new doodler joins the room
    registerEvent(RoomEvents.ON_DOODLER_JOIN, ({ doodler }) =>
      gameMethods.addDoodler(doodler)
    );

    // When a doodler leaves the room
    registerEvent(RoomEvents.ON_DOODLER_LEAVE, ({ doodler }) =>
      gameMethods.removeDoodler(doodler)
    );

    // When a game starts
    registerEvent(GameEvents.ON_GAME_START, () => {
      gameMethods.updateRoom('status', GameStatus.IN_GAME);
    });

    // When a game ends
    registerEvent(GameEvents.ON_GAME_END, () => {
      gameMethods.updateRoom('status', GameStatus.END);
    });

    // When a game comes to lobby
    registerEvent(GameEvents.ON_GAME_LOBBY, () => {
      gameMethods.updateRoom('status', GameStatus.LOBBY);
    });
  };

  useEffect(() => {
    if (!isConnected) {
      returnToHomePage();
      return;
    }
    setLoading(true);
    emitEvent(DoodlerEvents.EMIT_GET_DOODLER, undefined, ({ data, error }) => {
      if (error || !data) {
        openSnackbar({ message: error?.message, color: 'error' });
        returnToHomePage();
        return;
      }
      getGameDetails();
      handleEvents();
      setLoading(false);
    });
  }, [roomId, isConnected]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <Title small />
      <DetailBar />
      <div className="flex flex-grow gap-4">
        <Doodlers />
        <div className="flex-grow">
          <CanvasProvider>
            {gameState.room.status === GameStatus.IN_GAME && <InGame />}
            {gameState.room.status === GameStatus.LOBBY && <Lobby />}
            {gameState.room.status === GameStatus.END && <End />}
          </CanvasProvider>
        </div>
        <HunchList />
      </div>
    </div>
  );
};

export default GameLayout;
