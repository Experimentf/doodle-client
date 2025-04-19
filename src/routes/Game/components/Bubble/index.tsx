import React, { HTMLAttributes } from 'react';

const Bubble = (props: Omit<HTMLAttributes<HTMLDivElement>, 'className'>) => {
  return (
    <div
      className="flex gap-2 items-center justify-center border-2 rounded-sm border-chalk-white p-1 lg:p-3 w-full text-chalk-white text-xs lg:text-sm"
      {...props}
    />
  );
};

export default Bubble;
