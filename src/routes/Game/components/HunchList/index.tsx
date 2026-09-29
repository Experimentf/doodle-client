import { HTMLAttributes, useEffect, useRef } from 'react';

import texts from '@/constants/texts';
import { useHunches } from '@/contexts/hunch';

import HunchInput from '../HunchInput';
import Hunch from './Hunch';

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
            <Hunch
              hunch={hunch}
              key={index}
              className={`flex flex-row items-start my-1 rounded-lg whitespace-pre-wrap break-all hyphens-none ${
                hunch.isSystemMessage
                  ? 'justify-center [&>p]:text-light-chalk-green px-2'
                  : 'justify-start'
              }`}
            />
          ))}
        </ul>
        <HunchInput />
      </div>
    </div>
  );
};

export default HunchList;
