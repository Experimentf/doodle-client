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
      {!hunch.isSystemMessage && (
        <span className="text-light-chalk-white mr-1">
          {sender?.name ?? '???'}:
        </span>
      )}
      {isMutedNotice ? (
        <span className="text-[0.85em]">{hunch.message}</span>
      ) : (
        hunch.message
      )}
    </li>
  );
};

export default HunchMessage;
