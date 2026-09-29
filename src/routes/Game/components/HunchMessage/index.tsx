import { useRoom } from '@/contexts/room';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { getDoodlerById } from '@/utils/game';

const statusClass = (hunch: HunchInterface) => {
  if (hunch.isSystemMessage) return 'text-light-chalk-green text-center';
  switch (hunch.status) {
    case HunchStatus.CORRECT:
      return 'text-chalk-green font-bold';
    case HunchStatus.NEARBY:
      return 'text-chalk-yellow';
    default:
      return 'text-chalk-white';
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
      {hunch.message}
    </li>
  );
};

export default HunchMessage;
