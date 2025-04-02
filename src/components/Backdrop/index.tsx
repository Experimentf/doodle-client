import { PropsWithChildren, useEffect } from 'react';

const Backdrop = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full text-chalk-green bg-black bg-opacity-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};
export default Backdrop;
