import { MutableRefObject, useEffect, useRef } from 'react';

import { Coordinate } from '@/types/common';
import { pointerEventToCoordinate } from '@/utils/pointer';

interface PointerTrackerConfig {
  onPointerDrag?: (from: Coordinate, to: Coordinate) => void;
  onPointerDragEnd?: (dragPoints: Array<Coordinate>) => void;
  onPointerClick?: (point: Coordinate) => void;
}

const usePointerTracker = <T extends HTMLElement>(
  elementRef: MutableRefObject<T | null>,
  config?: PointerTrackerConfig
) => {
  const pointerDownCoordinate = useRef<Coordinate>();
  const isDragging = useRef(false);
  const dragPoints = useRef<Array<Coordinate>>([]);

  const handlePointerMovement = (ev: PointerEvent) => {
    if (!pointerDownCoordinate.current) return;
    isDragging.current = true;
    const currentCoordinate = pointerEventToCoordinate(ev);
    config?.onPointerDrag?.(pointerDownCoordinate.current, currentCoordinate);
    pointerDownCoordinate.current = currentCoordinate;
    dragPoints.current.push(currentCoordinate);
  };

  const handlePointerDown = (ev: PointerEvent) => {
    const currentCoordinate = pointerEventToCoordinate(ev);
    pointerDownCoordinate.current = currentCoordinate;
    dragPoints.current.push(currentCoordinate);
  };

  const handlePointerUp = (ev: PointerEvent) => {
    if (!isDragging.current)
      config?.onPointerClick?.(pointerEventToCoordinate(ev));
    handlePointerLeave();
  };

  const handlePointerLeave = () => {
    if (isDragging.current) config?.onPointerDragEnd?.(dragPoints.current);
    pointerDownCoordinate.current = undefined;
    isDragging.current = false;
    dragPoints.current = [];
  };

  useEffect(() => {
    if (config && !!Object.keys(config).length && elementRef.current) {
      elementRef.current.addEventListener('pointermove', handlePointerMovement);
      elementRef.current.addEventListener('pointerdown', handlePointerDown);
      elementRef.current.addEventListener('pointerup', handlePointerUp);
      elementRef.current.addEventListener('pointercancel', handlePointerLeave);
      elementRef.current.addEventListener('pointerleave', handlePointerLeave);
      elementRef.current.addEventListener('pointerout', handlePointerLeave);
    }
    return () => {
      elementRef.current?.removeEventListener(
        'pointermove',
        handlePointerMovement
      );
      elementRef.current?.removeEventListener('pointerdown', handlePointerDown);
      elementRef.current?.removeEventListener('pointerup', handlePointerUp);
      elementRef.current?.removeEventListener(
        'pointercancel',
        handlePointerLeave
      );
      elementRef.current?.removeEventListener(
        'pointerleave',
        handlePointerLeave
      );
      elementRef.current?.removeEventListener('pointerout', handlePointerLeave);
    };
  }, [config]);
};

export default usePointerTracker;
