import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';

import texts from '@/constants/texts';
import { useGame } from '@/contexts/game';
import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import { GameStatus } from '@/types/models/game';

interface HunchInputProps {
  className?: string;
  showCaption?: boolean;
}

const HunchInput = ({
  className = '',
  showCaption = true,
}: HunchInputProps) => {
  const { room } = useRoom();
  const { game } = useGame();
  const {
    user: { id },
  } = useUser();
  const { sendHunch } = useHunches();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hunch, setHunch] = useState('');
  const isDrawer = id === room.drawerId;

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key !== 'Enter' || !hunch) return;
    await sendHunch(hunch.trim());
    setHunch('');
  };

  // Non-drawers can only hunch during an active round, so put them straight into the input.
  useEffect(() => {
    if (game.status === GameStatus.GAME && !isDrawer) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [game.status, isDrawer]);

  return (
    <div className={`flex flex-col items-end gap-1 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={hunch}
        placeholder={texts.game.hunchList.input.placeholder}
        className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-base lg:text-sm font-thin disabled:cursor-not-allowed"
        onKeyDown={handleKeyDown}
        onChange={(e) => setHunch(e.target.value)}
        enterKeyHint="send"
      />
      {showCaption && (
        <p className="text-[0.5rem] text-light-chalk-white">
          {texts.game.hunchList.input.caption}
        </p>
      )}
    </div>
  );
};

export default HunchInput;
