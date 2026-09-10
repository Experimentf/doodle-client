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
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { playCorrectGuessSound } from '@/utils/sounds/soundCorrectGuess';
import { playMessageSentSound } from '@/utils/sounds/soundMessageSent';

import Hunch from './Hunch';

const HunchList = (props: HTMLAttributes<HTMLDivElement>) => {
  const { room } = useRoom();
  const { game } = useGame();
  const {
    user: { id },
  } = useUser();
  const { asyncEmitEvent, registerEvent, unregisterEvent } = useSocket();
  const listRef = useRef<HTMLUListElement>(null);
  const hunchInputRef = useRef<HTMLInputElement>(null);
  const [hunch, setHunch] = useState('');
  const [hunchList, setHunchList] = useState<HunchInterface[]>([
    { isSystemMessage: true, message: 'Your hunches go here!' },
  ]);
  const isDrawer = id === room.drawerId;

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
    // Only a genuine correct guess gets the celebratory sound - other
    // system messages (e.g. "not enough players") stay silent instead of
    // playing a mismatched success cue.
    if (hunchResponse.status === HunchStatus.CORRECT) playCorrectGuessSound();
    else if (hunchResponse.senderId === id) playMessageSentSound();
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

  // Non-drawers can only hunch, so put them straight into the input.
  useEffect(() => {
    if (game.status !== GameStatus.LOBBY && !isDrawer) {
      hunchInputRef.current?.focus({ preventScroll: true });
    }
  }, [game.status, isDrawer]);

  // Mobile browsers re-scroll to the focused input while typing, not just
  // on focus, with no API to disable it - lock page scroll instead, after
  // a delay so the browser's own initial scroll-into-view can finish.
  useEffect(() => {
    const input = hunchInputRef.current;
    if (!input) return;

    let lockTimeout: ReturnType<typeof setTimeout> | undefined;

    const lockPageScroll = () => {
      lockTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        document.body.dataset.lockedScrollY = String(scrollY);
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
      }, 300);
    };

    const unlockPageScroll = () => {
      clearTimeout(lockTimeout);
      const { lockedScrollY } = document.body.dataset;
      if (lockedScrollY === undefined) return;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      delete document.body.dataset.lockedScrollY;
      window.scrollTo(0, Number(lockedScrollY));
    };

    input.addEventListener('focus', lockPageScroll);
    input.addEventListener('blur', unlockPageScroll);
    return () => {
      input.removeEventListener('focus', lockPageScroll);
      input.removeEventListener('blur', unlockPageScroll);
      unlockPageScroll();
    };
  }, []);

  return (
    <div {...props}>
      <div className="p-2 lg:p-4 bg-card-surface-2 rounded-lg shadowed flex-1 flex flex-col h-full min-h-0">
        <h1 className="text-base lg:text-lg whitespace-nowrap text-chalk-white">
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
            ref={hunchInputRef}
            type="text"
            value={hunch}
            placeholder={texts.game.hunchList.input.placeholder}
            className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-xs lg:text-sm font-thin disabled:cursor-not-allowed"
            onKeyDown={handleSendHunch}
            onChange={handleChangeHunch}
          />
          <p className="text-[0.5rem] text-light-chalk-white">
            {texts.game.hunchList.input.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HunchList;
