import React, { useEffect, useMemo, useState } from 'react';
import { FaCopy, FaShare } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import { ReactComponent as Brand } from '@/assets/brand.svg';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import CanvasProvider from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSnackbar } from '@/contexts/snackbar';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';
import { GameStatusChangeData } from '@/types/socket/game';
import { ErrorFromServer } from '@/utils/error';

import Bubble from './components/Bubble';
import DetailBar from './components/DetailBar';
import DoodlerList from './components/DoodlerList';
import HunchList from './components/HunchList';
import Main from './Main';
import ChooseWord from './Status/ChooseWord';
import Lobby from './Status/Lobby';
import Result from './Status/Result';
import RoundStart from './Status/RoundStart';
import TurnEnd from './Status/TurnEnd';

const GameLayout = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { user } = useUser();
  const { registerEvent, asyncEmitEvent, socketConnectionState } = useSocket();
  const { game, setGame } = useGame();
  const {
    room: { isPrivate },
    setRoom,
  } = useRoom();

  const { openSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [statusChangeData, setStatusChangeData] =
    useState<GameStatusChangeData>();

  const returnToHomePage = () => {
    navigate('/', { replace: true });
  };

  const handleEventsRegistration = () => {
    // When a new doodler joins the room
    registerEvent(RoomEvents.ON_DOODLER_JOIN, ({ doodler }) => {
      setRoom((prev) => ({ ...prev, doodlers: [...prev.doodlers, doodler] }));
      openSnackbar({
        message: `${doodler.name} has joined the room!`,
        color: 'warning',
      });
    });

    // When a doodler leaves the room
    registerEvent(RoomEvents.ON_DOODLER_LEAVE, ({ doodlerId }) => {
      setRoom((prev) => ({
        ...prev,
        doodlers: prev.doodlers.filter(({ id }) => id !== doodlerId),
      }));
    });

    // When a game starts
    registerEvent(
      GameEvents.ON_GAME_STATUS_UPDATED,
      ({ room, game, statusChangeData }) => {
        setRoom((prev) => ({ ...room, doodlers: prev.doodlers }));
        if (game) setGame(game);
        setStatusChangeData(statusChangeData);
        if (statusChangeData?.[GameStatus.TURN_END]?.scores) {
          const addedScores = statusChangeData[GameStatus.TURN_END].scores;
          setRoom((prev) => ({
            ...prev,
            doodlers: prev.doodlers.map((doodler) => ({
              ...doodler,
              score: doodler.score + (addedScores[doodler.id] ?? 0),
            })),
          }));
        }
      }
    );
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

  const handleCopy = () => {
    const inviteLink = `${location.origin}?roomId=${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    openSnackbar({ message: 'Copied invite link!', color: 'success' });
  };

  useEffect(() => {
    if (socketConnectionState !== SocketConnectionState.CONNECTED) {
      returnToHomePage();
      return;
    }
    handleSetup();
  }, [roomId, socketConnectionState]);

  const gameComponent = useMemo(() => {
    switch (game.status) {
      case GameStatus.LOBBY:
        return <Lobby />;
      case GameStatus.CHOOSE_WORD:
        return (
          <ChooseWord
            wordOptions={statusChangeData?.[game.status]?.wordOptions}
          />
        );
      case GameStatus.TURN_END:
        return <TurnEnd scores={statusChangeData?.[game.status]?.scores} />;
      case GameStatus.ROUND_START:
        return <RoundStart />;
      case GameStatus.RESULT:
        return <Result results={statusChangeData?.[game.status]?.results} />;
      default:
        return null;
    }
  }, [game.status]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="p-4 h-screen flex flex-col gap-4 max-w-7xl m-auto">
      <Brand className="w-48" />
      <DetailBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="grid gap-4 grid-cols-2 grid-rows-[auto_1fr] lg:grid-cols-[15rem_1fr_15rem] lg:grid-rows-1 w-full h-full">
          <DoodlerList className="col-start-1 row-start-2 lg:col-start-1 lg:row-start-1 h-full flex flex-col min-h-0 pr-2 pb-2" />
          <div className="col-start-1 col-span-2 row-start-1 lg:col-start-2 lg:col-span-1 lg:row-start-1 h-full">
            <CanvasProvider>
              <Main component={gameComponent} className="relative" />
            </CanvasProvider>
          </div>
          <HunchList className="col-start-2 row-start-2 lg:col-start-3 lg:row-start-1 h-full flex flex-col min-h-0 pr-2 pb-2" />
        </div>
      </div>
      {isPrivate && (
        <Bubble>
          <FaShare />
          {texts.game.privateLobby.share}
          <Button
            variant="secondary"
            className="flex items-center gap-2 !py-1"
            onClick={handleCopy}
          >
            Copy <FaCopy />
          </Button>
        </Bubble>
      )}
    </div>
  );
};

export default GameLayout;
