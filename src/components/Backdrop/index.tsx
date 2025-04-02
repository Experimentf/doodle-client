import { PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Backdrop = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <div className="z-40 fixed top-0 left-0 w-screen h-screen text-chalk-green bg-black bg-opacity-50 flex flex-col justify-center items-center">
      {children}
    </div>,
    document.body
  );
};
export default Backdrop;
