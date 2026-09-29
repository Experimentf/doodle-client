import { HTMLAttributes, useEffect, useRef } from 'react';

import texts from '@/constants/texts';
import { useHunches } from '@/contexts/hunch';

import HunchInput from '../HunchInput';
import HunchMessage from '../HunchMessage';

const HunchList = (props: HTMLAttributes<HTMLDivElement>) => {
  const { hunches } = useHunches();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      top: listRef.current.scrollHeight,
    });
  }, [hunches]);

  return (
    <div {...props}>
      <div className="p-2 lg:p-4 bg-card-surface-2 rounded-lg shadowed flex-1 flex flex-col h-full min-h-0">
        <h1 className="text-base lg:text-lg whitespace-nowrap text-chalk-white">
          {texts.game.hunchList.sectionTitle}
        </h1>
        <hr className="my-2 text-chalk-white" />
        <ul
          ref={listRef}
          className="my-2 flex-1 overflow-y-scroll overflow-x-hidden bg-scroll min-h-0"
        >
          {hunches.map((hunch, index) => (
            <HunchMessage
              key={index}
              hunch={hunch}
              className="my-1 text-xs lg:text-sm"
            />
          ))}
        </ul>
        <HunchInput />
      </div>
    </div>
  );
};

export default HunchList;
