import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loading from '@/components/Loading';
import Title from '@/components/Title';
import { Events } from '@/constants/Events';
import { GameContext } from '@/contexts/GameContext';
import { SnackbarContext } from '@/contexts/SnackbarContext';
import { SocketContext } from '@/contexts/SocketContext';
import { GameStatus, MemberInterface, RoomType } from '@/types/game';

import DetailBar from './components/DetailBar';
import End from './components/End/End';
import GuessArea from './components/GuessArea';
import InGame from './components/InGame';
import Lobby from './components/Lobby/Lobby';
import MemberList from './components/MemberList';

const GameLayout = () => {
  const mountRef = useRef(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { socket } = useContext(SocketContext);
  const { open: openSnackbar } = useContext(SnackbarContext);
  const game = useContext(GameContext);

  const returnToHomePage = () => navigate('/', { replace: true });

  const getGameDetails = () => {
    socket.emit(
      Events.GET_GAME_DETAILS,
      roomId,
      (
        data: {
          capacity: number;
          status: GameStatus;
          type: RoomType;
          members: [MemberInterface];
        },
        error: Error
      ) => {
        if (error) {
          openSnackbar({ message: error.message, color: 'error' });
          returnToHomePage();
          return;
        }
        game.setRoom({
          status: data.status,
          type: data.type,
          capacity: data.capacity,
        });
        game.setMembers(data.members);
      }
    );
  };

  const handleEvents = () => {
    // When a new member joins the room
    socket.on(Events.ON_NEW_USER, (newMember: MemberInterface) => {
      game.setMembers((prev) => [...prev, newMember]);
    });

    // When a member leaves the room
    socket.on(Events.ON_USER_LEAVE, (oldMember: MemberInterface) => {
      game.setMembers((prev) =>
        prev.filter((data) => data.id !== oldMember.id)
      );
    });

    // When a game starts
    socket.on(Events.ON_GAME_START, () => {
      game.setRoom((prev) => ({ ...prev, status: GameStatus.IN_GAME }));
    });

    // When a game ends
    socket.on(Events.ON_GAME_END, () => {
      game.setRoom((prev) => ({ ...prev, status: GameStatus.END }));
    });

    // When a game comes to lobby
    socket.on(Events.ON_GAME_LOBBBY, () => {
      game.setRoom((prev) => ({ ...prev, status: GameStatus.LOBBY }));
    });
  };

  useEffect(() => {
    if (mountRef.current) return;
    if (!socket || !socket.connected) {
      returnToHomePage();
      return;
    }
    setLoading(true);

    socket.emit(Events.GET_USER, ({ name }: { name: string }, error: Error) => {
      if (error || !name) {
        openSnackbar({ message: error.message, color: 'error' });
        returnToHomePage();
        return;
      }
      getGameDetails();
      handleEvents();
      setLoading(false);
    });
    mountRef.current = true;
  }, [roomId, socket]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <Title small />
      <DetailBar />
      <div className="flex flex-grow gap-4">
        <MemberList />
        <div className="flex-grow">
          {game.room.status === GameStatus.IN_GAME && <InGame />}
          {game.room.status === GameStatus.LOBBY && <Lobby />}
          {game.room.status === GameStatus.END && <End />}
        </div>
        <GuessArea />
      </div>
    </div>
  );
};

export default GameLayout;
