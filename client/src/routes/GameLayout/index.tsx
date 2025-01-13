import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { Events } from '../../constants/Events';
import { GameStatus, MemberInterface, RoomType } from '../../types/game';
import Lobby from './Lobby/Lobby';
import End from './End/End';
import Title from '../../components/Title/Title';
import Game from './Game/Game';
import MemberList from './components/MemberList';
import GuessArea from './components/GuessArea';
import { GameContext } from '../../contexts/GameContext';

const GameLayout = () => {
  const mountRef = useRef(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  const { open: openSnackbar } = useContext(SnackbarContext);
  const game = useContext(GameContext);

  const getLayout = () => {
    if (game.room.status === GameStatus.IN_GAME) return <Game />;
    if (game.room.status === GameStatus.LOBBY) return <Lobby />;
    return <End />;
  };

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

        game.updateRoom({
          status: data.status,
          type: data.type,
          capacity: data.capacity,
        });
        game.updateMembers(data.members);
      }
    );
  };

  const handleEvents = () => {
    // When a new member joins the room
    socket.on(Events.ON_NEW_USER, (newMember: MemberInterface) => {
      game.updateMembers([...game.members, newMember]);
    });

    // When a member leaves the room
    socket.on(Events.ON_USER_LEAVE, (oldMember: MemberInterface) => {
      game.updateMembers(
        game.members.filter((data) => data.id !== oldMember.id)
      );
    });

    // When a game starts
    socket.on(Events.ON_GAME_START, () => {
      game.updateRoom({ ...game.room, status: GameStatus.IN_GAME });
    });

    // When a game ends
    socket.on(Events.ON_GAME_END, () => {
      game.updateRoom({ ...game.room, status: GameStatus.END });
    });

    // When a game comes to lobby
    socket.on(Events.ON_GAME_LOBBBY, () => {
      game.updateRoom({ ...game.room, status: GameStatus.LOBBY });
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="p-4">
        <Title small />
      </div>
      <div className="p-4 flex gap-8">
        <MemberList members={game.members} />
        {getLayout()}
        <GuessArea />
      </div>
    </div>
  );
};

export default GameLayout;
