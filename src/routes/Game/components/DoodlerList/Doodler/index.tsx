import { FaCrown, FaPencil } from 'react-icons/fa6';

import Avatar from '@/components/Avatar';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { useUser } from '@/contexts/user';
import { DoodlerInterface } from '@/types/models/doodler';
import { CROWN_COLORS } from '@/utils/rank';

interface DoodlerProps {
  doodler: DoodlerInterface;
  position: number;
  isDrawing: boolean;
  crownRank?: number;
  hunched?: boolean;
  // Set briefly when the doodler's name is clicked in the hunch list; a new value replays the flash
  highlightNonce?: number;
  // A new value makes the avatar talk (they just sent a hunch)
  talkNonce?: number;
}

const Doodler = ({
  doodler,
  isDrawing,
  crownRank,
  hunched = false,
  highlightNonce,
  talkNonce,
}: DoodlerProps) => {
  const { user } = useUser();

  return (
    <div
      data-doodler-id={doodler.id}
      // isolate: the flash overlay (-z-10) paints above this row's background but below its content.
      className={`relative isolate flex items-center gap-1 px-1 rounded-lg text-xs lg:text-sm transition-colors duration-500 ${
        hunched ? 'bg-chalk-green/10' : ''
      }`}
    >
      {highlightNonce !== undefined && (
        <span
          key={highlightNonce}
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-lg bg-chalk-yellow/30 animate-flash-twice pointer-events-none"
        />
      )}
      <div className="relative w-fit shrink-0">
        <Avatar
          className="w-[75px] lg:w-16"
          avatar={doodler.avatar}
          expression={hunched ? 'happy' : isDrawing ? 'focused' : undefined}
          talkNonce={talkNonce}
          pokeable={user.id === doodler.id}
        />
        {crownRank !== undefined && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 text-xl lg:text-2xl drop-shadow"
            style={{ color: CROWN_COLORS[crownRank] }}
          >
            <FaCrown />
          </span>
        )}
        {isDrawing && (
          <span className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-chalk-yellow border-2 border-card-surface-2">
            <FaPencil className="text-dark-board-green text-[0.6rem] lg:text-xs animate-bounce" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-1 min-w-0 max-w-full">
          <p className="text-light-chalk-white truncate" title={doodler.name}>
            {doodler.name}
          </p>
          {user.id === doodler.id && (
            <Text component={'span'} className="text-light-chalk-blue shrink-0">
              {texts.game.doodlers.userMarker}
            </Text>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <Text className="text-[0.6rem] lg:text-xs">Points -</Text>
          <Text component="p" className="text-chalk-yellow text-xs lg:text-sm">
            {doodler.score}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default Doodler;
