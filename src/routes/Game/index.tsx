import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { FaCopy, FaShare, FaShareNodes } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AnimatedBrand from '@/components/AnimatedBrand';
import Button from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import Loading from '@/components/Loading';
import SoundToggle from '@/components/SoundToggle';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import CanvasProvider from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import HunchProvider from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { useSnackbar } from '@/contexts/snackbar';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import useMediaQuery from '@/hooks/useMediaQuery';
import { GameStatus } from '@/types/models/game';
import { GameStatusChangeData } from '@/types/socket/game';
import { ErrorFromServer } from '@/utils/error';
import { playDoodlerJoinSound } from '@/utils/sounds/soundDoodlerJoin';

import Bubble from './components/Bubble';
import DetailBar from './components/DetailBar';
import DoodlerList from './components/DoodlerList';
import HunchFeed from './components/HunchFeed';
import HunchInput from './components/HunchInput';
import HunchList from './components/HunchList';
import PlayerPanel from './components/PlayerPanel';
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

  // Matches Tailwind's lg breakpoint; below it the compact layout keeps the canvas fully on screen.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  // Phones in landscape: too short to stack canvas + feed + input, so they go side by side.
  const isShortLandscape = useMediaQuery(
    '(orientation: landscape) and (max-height: 500px)'
  );
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
    });
    setGame(game);
  };

  const handleSetup = async () => {
    try {
      // Independent requests - run them together instead of serially.
      const [, roomData] = await Promise.all([
        handleValidateUser(),
        handleGetRoom(),
      ]);
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
        });
      }
      returnToHomePage();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const inviteLink = `${location.origin}?roomId=${roomId}`;
    try {
      // navigator.clipboard is undefined on insecure origins (e.g. a LAN IP over http), so this can throw too.
      await navigator.clipboard.writeText(inviteLink);
      openSnackbar({ message: 'Copied invite link!', color: 'success' });
    } catch {
      openSnackbar({
        message: `Couldn't copy - ${inviteLink}`,
        color: 'error',
      });
    }
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

  const header = (
    <div className="flex flex-row justify-between items-center">
      <Link to="/" replace>
        <AnimatedBrand className="w-32 lg:w-48" />
      </Link>
      <div className="flex items-center gap-4">
        {isPrivate && (
          <IconButton
            variant="primary"
            color="primary"
            className="text-2xl"
            onClick={handleCopy}
            type="button"
            tooltip="Copy invite link"
            icon={<FaShareNodes />}
          />
        )}
        <SoundToggle />
      </div>
    </div>
  );

  const inviteBubble = (
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
  );
  const showInvite = isPrivate && game.status === GameStatus.LOBBY;

  if (!isDesktop) {
    return (
      <HunchProvider>
        <div className="p-2 h-[100dvh] flex flex-col gap-2 max-w-7xl m-auto sm:text-sm text-base overflow-hidden">
          {header}
          <DetailBar />
          <CanvasProvider>
            <Main
              compact
              side={isShortLandscape}
              component={gameComponent}
              className={`flex-1 min-h-0 flex gap-2 ${
                isShortLandscape ? 'flex-row' : 'flex-col'
              }`}
              feed={<HunchFeed className="flex-1" />}
              hunchInput={<HunchInput showCaption={false} />}
              players={<PlayerPanel dense={isShortLandscape} />}
            />
          </CanvasProvider>
          {showInvite && inviteBubble}
        </div>
      </HunchProvider>
    );
  }

  return (
    <HunchProvider>
      <div className="p-2 lg:p-4 h-[100dvh] lg:h-auto lg:min-h-[100dvh] flex flex-col gap-2 lg:gap-4 max-w-7xl m-auto sm:text-sm text-base">
        {header}
        <DetailBar />
        {/* On lg the page grows with the canvas + toolbar instead of clipping them under the invite bubble. */}
        <div className="flex-1 flex overflow-hidden lg:overflow-visible">
          <div className="grid gap-2 lg:gap-4 grid-cols-2 grid-rows-[auto_1fr] lg:grid-cols-[15rem_1fr_15rem] lg:grid-rows-1 w-full h-full lg:h-auto">
            <DoodlerList className="col-start-1 row-start-2 lg:col-start-1 lg:row-start-1 h-full lg:h-0 flex flex-col min-h-0 lg:min-h-full pr-2 pb-2" />
            <div className="col-start-1 col-span-2 row-start-1 lg:col-start-2 lg:col-span-1 lg:row-start-1 h-full">
              <CanvasProvider>
                <Main component={gameComponent} className="relative" />
              </CanvasProvider>
            </div>
            <HunchList className="col-start-2 row-start-2 lg:col-start-3 lg:row-start-1 h-full lg:h-0 flex flex-col min-h-0 lg:min-h-full pr-2 pb-2" />
          </div>
        </div>
        {showInvite && (
          // Mirrors the game grid's columns so on lg the bubble spans only the canvas column.
          <div className="lg:grid lg:grid-cols-[15rem_1fr_15rem] lg:gap-4">
            <div className="lg:col-start-2">{inviteBubble}</div>
          </div>
        )}
      </div>
    </HunchProvider>
  );
};

export default GameLayout;
