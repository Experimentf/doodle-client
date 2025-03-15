import { MutableRefObject, useEffect, useRef } from 'react';

import { Coordinate } from '@/types/common';

import { pointerEventToCoordinate } from './utils';

interface PointerTrackerConfig {
  onPointerDrag?: (from: Coordinate, to: Coordinate) => void;
  onPointerDragEnd?: () => void;
  onPointerClick?: () => void;
}

const usePointerTracker = <T extends HTMLElement>(
  elementRef: MutableRefObject<T | null>,
  config?: PointerTrackerConfig
) => {
  const pointerDownCoordinate = useRef<Coordinate>();
  const isDragging = useRef(false);

  const handlePointerMovement = (ev: PointerEvent) => {
    if (!pointerDownCoordinate.current) return;
    isDragging.current = true;
    const currentCoordinate = pointerEventToCoordinate(ev);
    config?.onPointerDrag?.(pointerDownCoordinate.current, currentCoordinate);
    pointerDownCoordinate.current = currentCoordinate;
  };

  const handlePointerDown = (ev: PointerEvent) => {
    pointerDownCoordinate.current = pointerEventToCoordinate(ev);
  };

  const handlePointerUp = () => {
    if (isDragging.current) config?.onPointerDragEnd?.();
    else config?.onPointerClick?.();
    pointerDownCoordinate.current = undefined;
    isDragging.current = false;
  };

  useEffect(() => {
    if (config && !!Object.keys(config).length && elementRef.current) {
      elementRef.current.addEventListener('pointermove', handlePointerMovement);
      elementRef.current.addEventListener('pointerdown', handlePointerDown);
      elementRef.current.addEventListener('pointerup', handlePointerUp);
      elementRef.current.addEventListener('pointercancel', handlePointerUp);
      elementRef.current.addEventListener('pointerleave', handlePointerUp);
      elementRef.current.addEventListener('pointerout', handlePointerUp);
    }
    return () => {
      elementRef.current?.removeEventListener(
        'pointermove',
        handlePointerMovement
      );
      elementRef.current?.removeEventListener('pointerdown', handlePointerDown);
      elementRef.current?.removeEventListener('pointerup', handlePointerUp);
      elementRef.current?.removeEventListener('pointercancel', handlePointerUp);
      elementRef.current?.removeEventListener('pointerleave', handlePointerUp);
      elementRef.current?.removeEventListener('pointerout', handlePointerUp);
    };
  }, [config]);
};

export default usePointerTracker;
