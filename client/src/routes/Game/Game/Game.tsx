import React, { PropsWithChildren } from 'react';
import { MemberType } from '../../../types/game';

interface GameProps extends PropsWithChildren {
  members: MemberType[];
}

const Game = ({ children }: GameProps) => {
  return (
    <div>
      {children}
      <div>Game</div>
    </div>
  );
};

export default Game;
