import { useEffect, useRef } from 'react';
import { X } from 'react-feather';

import { ColorType } from '@/types/styles';
import { getVariantClass } from '@/utils/variants';

import { SnackbarClassSource } from './utils';

interface SnackbarOptions {
  open: boolean;
  message: string;
  handleClose: () => void;
  color?: ColorType;
  isInfinite: boolean;
  duration: number;
  timestamp: number;
}

const Snackbar = ({
  open,
  message,
  handleClose,
  isInfinite,
  duration,
  timestamp,
  color = 'primary',
}: SnackbarOptions) => {
  const variantClass = getVariantClass('primary', color, SnackbarClassSource);
  const requestId = useRef<number>();
  const progressRef = useRef<HTMLDivElement>(null);

  const handleAnimation = () => {
    const diff = Date.now() - timestamp;
    if (progressRef.current)
      progressRef.current.style.width = (diff * 100) / duration + '%';
    requestId.current = window.requestAnimationFrame(handleAnimation);
  };

  useEffect(() => {
    requestId.current = window.requestAnimationFrame(handleAnimation);

    return () => {
      requestId.current && window.cancelAnimationFrame(requestId.current);
    };
  }, [timestamp]);

  return (
    <div
      className={`fixed left-0 bottom-0 m-5 max-w-full transition-all rounded-lg overflow-hidden ${variantClass} ${
        open
          ? 'visible opacity-100 translate-y-0 pointer-events-auto'
          : 'invisible opacity-0 translate-y-full pointer-events-none'
      }`}
    >
      <div className="relative">
        <button className="absolute right-0 top-0 m-2" onClick={handleClose}>
          <X className="stroke-board-green" size={18} />
        </button>
      </div>
      <p className="py-5 px-8">{message}</p>
      {open && !isInfinite && (
        <div ref={progressRef} className="bg-light-chalk-pink h-1" />
      )}
    </div>
  );
};

export default Snackbar;
