import React, { useContext } from 'react';
import { SocketContext } from '../../../contexts/SocketContext';

const Game = () => {
  const socket = useContext(SocketContext);

  return (
    <div className="w-full">
      <div>Game</div>
    </div>
  );
};

export default Game;
