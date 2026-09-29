import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';

import useMediaQuery from '@/hooks/useMediaQuery';

interface SheetProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  // Shown with a divider below it; without it the header is just the close button.
  title?: ReactNode;
  // Accessible name when the title isn't plain text (or there is none).
  ariaLabel?: string;
}

// Bottom sheet in portrait, side sheet in landscape. The header (title, divider, close) stays
// fixed; only the body scrolls.
const Sheet = ({ isOpen, onClose, title, ariaLabel, children }: SheetProps) => {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const offscreen = isLandscape ? { x: '100%' } : { y: '100%' };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sheet-backdrop"
          className="fixed inset-0 z-40 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      {isOpen && (
        <motion.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={
            ariaLabel ?? (typeof title === 'string' ? title : undefined)
          }
          className={`fixed z-50 flex flex-col bg-card-surface-2 shadow-lg ${
            isLandscape
              ? 'top-0 right-0 h-full w-80 max-w-[85vw] rounded-l-2xl'
              : 'bottom-0 inset-x-0 max-h-[75dvh] rounded-t-2xl'
          }`}
          initial={offscreen}
          animate={{ x: 0, y: 0 }}
          exit={offscreen}
          transition={{ type: 'tween', duration: 0.2 }}
        >
          <div className="flex-none px-4 pt-3">
            <div
              className={`flex items-center gap-2 ${
                title ? 'justify-between' : 'justify-end'
              }`}
            >
              {title && (
                <h1 className="text-lg text-chalk-white truncate">{title}</h1>
              )}
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="shrink-0 p-1 text-chalk-white"
              >
                <FaXmark />
              </button>
            </div>
            {title && <hr className="mt-2 text-chalk-white" />}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 pt-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sheet;
