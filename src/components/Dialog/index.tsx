import { PropsWithChildren, ReactNode } from 'react';

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
    <div
      className="z-40 w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center"
      onClick={onClose}
    >
      <dialog
        className="w-full md:w-[600px] m-10 p-5 bg-light-board-green rounded flex flex-col gap-4"
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
          <div className="self-end flex flex-col-reverse gap-4 md:flex-row">
            {footer}
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Dialog;
