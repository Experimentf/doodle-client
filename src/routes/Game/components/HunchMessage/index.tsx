import { useHunches } from '@/contexts/hunch';
import { useRoom } from '@/contexts/room';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { getDoodlerById } from '@/utils/game';

// System messages are coloured by meaning too, so the placeholder and notices stay muted
// instead of looking like a correct hunch.
const statusClass = (hunch: HunchInterface) => {
  const align = hunch.isSystemMessage ? 'text-center' : '';
  switch (hunch.status) {
    case HunchStatus.CORRECT:
      return `text-chalk-green font-bold ${align}`;
    case HunchStatus.NEARBY:
      return `text-chalk-yellow ${align}`;
    default:
      return hunch.isSystemMessage
        ? `text-light-chalk-white ${align}`
        : 'text-chalk-white';
  }
};

interface HunchMessageProps {
  hunch: HunchInterface;
  className?: string;
}

// One "name: message" row, shared by the compact feed and the desktop list.
const HunchMessage = ({ hunch, className = '' }: HunchMessageProps) => {
  const { room } = useRoom();
  const { highlightDoodler } = useHunches();
  const sender = hunch.isSystemMessage
    ? undefined
    : getDoodlerById(room.doodlers, hunch.senderId);
  // Muted notices (e.g. the placeholder) are also smaller; em keeps them relative to each list's size.
  const isMutedNotice =
    hunch.isSystemMessage &&
    hunch.status !== HunchStatus.CORRECT &&
    hunch.status !== HunchStatus.NEARBY;

  return (
    <li
      className={`whitespace-pre-wrap break-words ${statusClass(
        hunch
      )} ${className}`}
    >
      {!hunch.isSystemMessage &&
        (sender ? (
          // Names can repeat, so a click points at the exact doodler in the list.
          <button
            type="button"
            onClick={() => highlightDoodler(sender.id)}
            className="mr-1 text-light-chalk-white hover:underline focus-visible:underline outline-none"
          >
            {sender.name}:
          </button>
        ) : (
          <span className="mr-1 text-light-chalk-white">???:</span>
        ))}
      {isMutedNotice ? (
        <span className="text-[0.85em]">{hunch.message}</span>
      ) : (
        hunch.message
      )}
    </li>
  );
};

export default HunchMessage;
