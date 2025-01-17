import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SocketContext } from '@/contexts/SocketContext';

import Hunch from './Hunch';
import { HunchInterface } from './types';

const HunchList = () => {
  const { socket } = useContext(SocketContext);
  const listRef = useRef<HTMLUListElement>(null);
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
          hunch time !
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
            value={hunch}
            placeholder="Type your hunch ..."
            className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-sm font-thin"
            onKeyDown={handleSendHunch}
            onChange={handleChangeHunch}
          />
          <p className="text-[0.2em] text-light-chalk-white">
            Press enter to hunch
          </p>
        </div>
      </div>
    </div>
  );
};

export default HunchList;
