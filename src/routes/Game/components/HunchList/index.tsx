import {
  ChangeEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import { GameEvents } from '@/constants/Events';
import texts from '@/constants/texts';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { HunchInterface } from '@/types/models/hunch';

import Hunch from './Hunch';

const HunchList = (props: HTMLAttributes<HTMLDivElement>) => {
  const { room } = useRoom();
  const { asyncEmitEvent, registerEvent, unregisterEvent } = useSocket();
  const listRef = useRef<HTMLUListElement>(null);
  const [hunch, setHunch] = useState('');
  const [hunchList, setHunchList] = useState<HunchInterface[]>([
    { isSystemMessage: true, message: 'Your hunches go here!' },
  ]);

  const handleSendHunch: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key !== 'Enter' || !hunch) return;
    const data = await asyncEmitEvent(GameEvents.EMIT_GAME_HUNCH, {
      roomId: room.id,
      message: hunch.trim(),
    });
    handleOnReceiveHunch(data);
    setHunch('');
  };

  const handleChangeHunch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setHunch(e.target.value);
  };

  const handleOnReceiveHunch = ({
    hunch: hunchResponse,
  }: {
    hunch: HunchInterface;
  }) => {
    setHunchList((prev) => [...prev, hunchResponse]);
  };

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      top: listRef.current.scrollHeight,
    });
  }, [hunchList]);

  useEffect(() => {
    registerEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    return () => {
      unregisterEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    };
  }, []);

  return (
    <div {...props}>
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed flex-1 flex flex-col h-full min-h-0">
        <h1 className="text-lg whitespace-nowrap text-chalk-white">
          {texts.game.hunchList.sectionTitle}
        </h1>
        <hr className="my-2 text-chalk-white" />
        <ul
          ref={listRef}
          className="my-2 flex-1 overflow-y-scroll overflow-x-hidden bg-scroll min-h-0"
        >
          {hunchList.map((hunch, index) => (
            <Hunch
              hunch={hunch}
              key={index}
              className={`flex flex-row items-start my-1 rounded-lg whitespace-pre-wrap break-all hyphens-none ${
                hunch.isSystemMessage
                  ? 'justify-center [&>p]:text-light-chalk-green px-2'
                  : 'justify-start'
              }`}
            />
          ))}
        </ul>
        <div className="flex flex-col items-end gap-1">
          <input
            type="text"
            value={hunch}
            placeholder={texts.game.hunchList.input.placeholder}
            className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-sm font-thin disabled:cursor-not-allowed"
            onKeyDown={handleSendHunch}
            onChange={handleChangeHunch}
          />
          <p className="text-[0.2em] text-light-chalk-white">
            {texts.game.hunchList.input.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HunchList;
