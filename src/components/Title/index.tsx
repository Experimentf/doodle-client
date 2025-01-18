import React from 'react';

import texts from '@/constants/texts';

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  small?: boolean;
}

const Title = ({ small, className, ...props }: TitleProps) => {
  const sizeClass = small ? 'text-5xl' : 'text-9xl';
  const title = texts.common.metadata.title;
  const colors = [
    'text-chalk-white',
    'text-chalk-blue',
    'text-chalk-green',
    'text-chalk-pink',
    'text-chalk-yellow',
  ];

  return (
    <div className={`${className} ${sizeClass} font-sketch-chalk`} {...props}>
      <h1 className={sizeClass}>
        {title.split('').map((ch, index) => (
          <span
            key={index}
            className={`${colors[index % colors.length]} shadowed-text`}
            data-content={ch}
          >
            {ch}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Title;
