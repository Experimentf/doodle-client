import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import texts from '@/constants/texts';
import { GameContext } from '@/contexts/game/GameContext';
import { SocketContext } from '@/contexts/SocketContext';
import { GameStatus } from '@/types/game';

import Hunch from './Hunch';
import { HunchInterface } from './types';

const HunchList = () => {
  const { socket } = useContext(SocketContext);
  const { gameState } = useContext(GameContext);
  const listRef = useRef<HTMLUListElement>(null);
  const isHunchDisabled = gameState.room.status !== GameStatus.IN_GAME;
  const [hunch, setHunch] = useState('');
  const [hunchList, setHunchList] = useState<HunchInterface[]>([]);

  const handleSendHunch: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter' || !hunch) return;
    setHunchList((prev) => [
      ...prev,
      { message: hunch, senderId: socket.id, status: 'success' },
    ]);
    setHunch('');
  };

  const handleChangeHunch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setHunch(e.target.value);
  };

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      top: listRef.current.scrollHeight,
    });
  }, [hunchList]);

  return (
    <div className="max-w-[96]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col">
        <h1 className="text-lg whitespace-nowrap text-chalk-white">
          {texts.game.hunchList.sectionTitle}
        </h1>
        <hr className="my-2 text-chalk-white" />
        <ul
          ref={listRef}
          className="my-2 flex-grow h-[calc(100vh-326px)] overflow-y-scroll bg-scroll"
        >
          {hunchList.map((hunch, index) => (
            <Hunch
              hunch={hunch}
              key={index}
              className="flex flex-row items-center my-1"
            />
          ))}
        </ul>
        <div className="flex flex-col items-end gap-1">
          <input
            type="text"
            disabled={isHunchDisabled}
            value={hunch}
            placeholder={texts.game.hunchList.input.placeholder}
            className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-sm font-thin disabled:cursor-not-allowed"
            onKeyDown={handleSendHunch}
            onChange={handleChangeHunch}
          />
          <p
            className="text-[0.2em] text-light-chalk-white"
            style={{ visibility: isHunchDisabled ? 'hidden' : 'visible' }}
          >
            {texts.game.hunchList.input.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HunchList;
