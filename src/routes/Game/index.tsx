import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { FaCopy, FaShare } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AnimatedBrand from '@/components/AnimatedBrand';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import SoundToggle from '@/components/SoundToggle';
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
import { playDoodlerJoinSound } from '@/utils/sounds/soundDoodlerJoin';

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
      playDoodlerJoinSound();
      setRoom((prev) => ({ ...prev, doodlers: [...prev.doodlers, doodler] }));
      openSnackbar({
        message: `${doodler.name} has joined the room!`,
        color: 'warning',
      });
    });

    // When a doodler leaves the room - intentionally no sound, just the
    // snackbar below
    registerEvent(RoomEvents.ON_DOODLER_LEAVE, ({ doodler }) => {
      setRoom((prev) => ({
        ...prev,
        doodlers: prev.doodlers.filter(({ id }) => id !== doodler.id),
      }));
      openSnackbar({
        message: `${doodler.name} has left the room!`,
        color: 'warning',
      });
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
    if (!gameId || !roomId) return;
    const { game } = await asyncEmitEvent(GameEvents.EMIT_GET_GAME, {
      roomId,
      gameId,
    });
    setGame(game);
  };

  const handleSetup = async () => {
    try {
      await handleValidateUser();
      const roomData = await handleGetRoom();
      // ON_DOODLER_JOIN only broadcasts to players already in the room, so
      // the joiner never hears it - play the same join sound locally once
      // this client's own join is confirmed.
      playDoodlerJoinSound();
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

  useEffect(() => {
    if (!roomId) return;
    // When the room is left
    return () => {
      asyncEmitEvent(RoomEvents.EMIT_LEAVE_ROOM, { roomId }).catch(() => {});
    };
  }, [roomId]);

  const gameComponent = useMemo(() => {
    let statusView: ReactNode = null;
    switch (game.status) {
      case GameStatus.LOBBY:
        statusView = <Lobby />;
        break;
      case GameStatus.CHOOSE_WORD:
        statusView = (
          <ChooseWord
            wordOptions={statusChangeData?.[game.status]?.wordOptions}
          />
        );
        break;
      case GameStatus.TURN_END:
        statusView = (
          <TurnEnd scores={statusChangeData?.[game.status]?.scores} />
        );
        break;
      case GameStatus.ROUND_START:
        statusView = <RoundStart />;
        break;
      case GameStatus.RESULT:
        statusView = (
          <Result results={statusChangeData?.[game.status]?.results} />
        );
        break;
    }
    if (!statusView) return null;
    return (
      <div key={game.status} className="w-full h-full animate-fade-in-up">
        {statusView}
      </div>
    );
  }, [game.status]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="p-2 lg:p-4 h-[100dvh] flex flex-col gap-2 lg:gap-4 max-w-7xl m-auto sm:text-sm text-base">
      <div className="flex flex-row justify-between items-center">
        <Link to="/" replace>
          <AnimatedBrand className="w-32 lg:w-48" />
        </Link>
        <SoundToggle />
      </div>
      <DetailBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="grid gap-2 lg:gap-4 grid-cols-2 grid-rows-[auto_1fr] lg:grid-cols-[15rem_1fr_15rem] lg:grid-rows-1 w-full h-full">
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
            variant="primary"
            className="flex items-center gap-2 px-1 !py-1"
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
