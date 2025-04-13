import React, { HTMLAttributes } from 'react';

const Bubble = (props: Omit<HTMLAttributes<HTMLDivElement>, 'className'>) => {
  return (
    <div
      className="flex gap-2 items-center justify-center border-2 rounded-sm border-chalk-white p-3 w-full text-chalk-white"
      {...props}
    />
  );
};

export default Bubble;
