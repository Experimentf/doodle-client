import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react';
import { GameStatus, MemberInterface, Room, RoomType } from '../types/game';

interface GameContextType {
  members: Array<MemberInterface>;
  setMembers: Dispatch<SetStateAction<Array<MemberInterface>>>;
  room: Room;
  setRoom: Dispatch<SetStateAction<Room>>;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  word: string;
  setWord: Dispatch<SetStateAction<string>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
}

const defaultValues: GameContextType = {
  members: [],
  setMembers: () => [],
  room: {
    capacity: 0,
    status: GameStatus.LOBBY,
    type: RoomType.PUBLIC,
  },
  setRoom: () => ({} as Room),
  time: 0,
  setTime: () => 0,
  word: 'DUMMY WORD',
  setWord: () => '',
  score: 0,
  setScore: () => 0,
};

export const GameContext = createContext<GameContextType>(defaultValues);

const GameProvider = ({ children }: PropsWithChildren) => {
  const [members, setMembers] = useState<Array<MemberInterface>>(
    defaultValues.members
  );
  const [room, setRoom] = useState<Room>(defaultValues.room);
  const [time, setTime] = useState(defaultValues.time);
  const [word, setWord] = useState(defaultValues.word);
  const [score, setScore] = useState(defaultValues.score);

  return (
    <GameContext.Provider
      value={{
        members,
        setMembers,
        room,
        setRoom,
        time,
        setTime,
        word,
        setWord,
        score,
        setScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
