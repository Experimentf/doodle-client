import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa6';

import texts from '@/constants/texts';
import { useHunches } from '@/contexts/hunch';

import HunchMessage from '../HunchMessage';

// Fully transparent at the top, fully opaque only for the bottom-most line.
const FADE_MASK =
  'linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.45) 45%, #000 calc(100% - 1.75rem))';
const AT_BOTTOM_THRESHOLD_PX = 24;

interface HunchFeedProps {
  className?: string;
}

// Compact-layout hunch list: sits below the canvas (never over it) and fades older messages out.
const HunchFeed = ({ className = '' }: HunchFeedProps) => {
  const { hunches } = useHunches();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const seenCountRef = useRef(hunches.length);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    isAtBottomRef.current = true;
    setUnreadCount(0);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight <=
      AT_BOTTOM_THRESHOLD_PX;
    if (isAtBottomRef.current) setUnreadCount(0);
  };

  useLayoutEffect(() => scrollToBottom('auto'), []);

  // Rotation, the keyboard or the bottom row swapping resizes the feed; keep a bottom-pinned reader pinned.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottomRef.current) el.scrollTop = el.scrollHeight;
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Follow new messages only when already at the bottom; otherwise don't yank the reader down.
  useEffect(() => {
    const added = hunches.length - seenCountRef.current;
    seenCountRef.current = hunches.length;
    if (added <= 0) return;
    if (isAtBottomRef.current) scrollToBottom();
    else setUnreadCount((prev) => prev + added);
  }, [hunches]);

  return (
    <div className={`relative min-h-0 ${className}`}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      >
        <ul className="min-h-full flex flex-col justify-end gap-0.5 px-1">
          {hunches.map((hunch, index) => (
            <HunchMessage key={index} hunch={hunch} className="text-xs" />
          ))}
        </ul>
      </div>
      {unreadCount > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-chalk-yellow text-dark-board-green text-xs shadow-lg"
        >
          <FaArrowDown /> {texts.game.hunchList.newMessages} ({unreadCount})
        </button>
      )}
    </div>
  );
};

export default HunchFeed;
