import { PropsWithChildren, ReactNode } from 'react';

import Backdrop from '../Backdrop';
import Text from '../Text';

interface DialogProps extends PropsWithChildren {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  footer?: ReactNode;
}

const Dialog = ({ visible, onClose, title, footer, children }: DialogProps) => {
  if (!visible) return null;

  return (
    <Backdrop>
      <div
        className="z-40 flex justify-center items-center bg-light-board-green rounded-lg w-[calc(100%-2rem)] max-w-[600px]"
        onClick={onClose}
        tabIndex={0}
        autoFocus
      >
        <div
          className="w-full p-5 rounded flex flex-col gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <Text component="h3" className="text-center">
              {title}
            </Text>
          )}
          <div className="self-center flex flex-col justify-center items-center gap-4">
            {children}
          </div>
          {footer && (
            // Positional, not content-aware: whatever's passed in, the
            // first action gets less weight than the last (e.g. a
            // secondary "Close" before a primary "Retry"), spanning the
            // full width - consumers just pass buttons in order.
            <div className="flex flex-col-reverse gap-4 md:flex-row [&>*]:w-full md:[&>*:first-child]:flex-1 md:[&>*:last-child]:flex-[2]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Backdrop>
  );
};

export default Dialog;
