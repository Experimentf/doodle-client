import { MutableRefObject, useEffect, useState } from 'react';

import { Coordinate } from '@/types/common';

const usePointerMovement = <T extends HTMLElement>(
  elementRef: MutableRefObject<T | null>
) => {
  const [pointerCoordinate, setPointerCoordinate] = useState<Coordinate>({
    x: 0,
    y: 0,
  });

  const handlePointerMovement = (ev: PointerEvent) => {
    setPointerCoordinate({ x: ev.clientX, y: ev.clientY });
  };

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.addEventListener('pointermove', handlePointerMovement);
    }
    return () => {
      elementRef.current?.removeEventListener(
        'pointermove',
        handlePointerMovement
      );
    };
  }, []);

  return { pointerCoordinate };
};

export default usePointerMovement;
