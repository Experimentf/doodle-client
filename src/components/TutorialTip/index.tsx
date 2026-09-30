import { ReactNode, useId, useState } from 'react';

import Button from '@/components/Button';
import Text from '@/components/Text';
import { LocalStorageKeys } from '@/constants/LocalStorage';
import texts from '@/constants/texts';

// Arrow is a 12px square rotated 45°.
const ARROW_HALF = 6;

const hasSeen = (storageKey: LocalStorageKeys) => {
  try {
    return localStorage.getItem(storageKey) === 'true';
  } catch {
    return false;
  }
};

interface TutorialTipProps {
  // Where "seen" is remembered; once dismissed the tip never shows again in this browser.
  storageKey: LocalStorageKeys;
  visible?: boolean;
  children: ReactNode;
  dismissLabel?: string;
  // Which edge of the target the tip lines up with; the arrow sits on that side.
  align?: 'left' | 'right';
  // Distance from that edge to the arrow's center in px - half the target's width points at its middle.
  arrowOffset?: number;
}

// One-time hint that opens below the element it points at - render it inside a `relative` wrapper around that element.
const TutorialTip = ({
  storageKey,
  visible = true,
  children,
  dismissLabel = texts.common.tutorial.dismiss,
  align = 'right',
  arrowOffset = 12,
}: TutorialTipProps) => {
  const [isDismissed, setIsDismissed] = useState(() => hasSeen(storageKey));
  const messageId = useId();

  if (!visible || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // Storage blocked: hidden for this session only.
    }
  };

  const edge = arrowOffset - ARROW_HALF;

  return (
    <div
      role="dialog"
      aria-labelledby={messageId}
      className={`absolute top-full mt-3 z-30 w-56 animate-fade-in-up ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {/* The card below covers the square's lower half, leaving an upward arrow. */}
      <span
        className="absolute -top-1.5 w-3 h-3 rotate-45 bg-card-surface-2 border-l-2 border-t-2 border-chalk-white"
        style={align === 'right' ? { right: edge } : { left: edge }}
      />
      <div className="flex flex-col gap-2 p-3 rounded-md border-2 border-chalk-white bg-card-surface-2 shadowed">
        <Text id={messageId} className="text-xs lg:text-sm">
          {children}
        </Text>
        <Button
          variant="secondary"
          color="success"
          className="self-end !py-1 !px-3 text-xs lg:text-sm"
          onClick={handleDismiss}
        >
          {dismissLabel}
        </Button>
      </div>
    </div>
  );
};

export default TutorialTip;
