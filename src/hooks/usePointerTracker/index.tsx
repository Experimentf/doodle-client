import { MutableRefObject, useEffect, useRef } from 'react';

import { Coordinate } from '@/types/common';

interface PointerTrackerConfig {
  onPointerDrag?: (from: Coordinate, to: Coordinate) => void;
  onPointerDragEnd?: (_dragPoints: Array<Coordinate>) => void;
  onPointerClick?: (point: Coordinate) => void;
}

const usePointerTracker = <T extends HTMLCanvasElement>(
  elementRef: MutableRefObject<T | null>,
  config?: PointerTrackerConfig
) => {
  const _pointerDownCoordinate = useRef<Coordinate>();
  const _isDragging = useRef(false);
  const _dragPoints = useRef<Array<Coordinate>>([]);

  const _getCoordinate = (ev: PointerEvent): Coordinate => ({
    x: ev.offsetX,
    y: ev.offsetY,
  });

  const _handlePointerMovement = (ev: PointerEvent) => {
    if (!_pointerDownCoordinate.current) return;
    _isDragging.current = true;
    const currentCoordinate = _getCoordinate(ev);
    config?.onPointerDrag?.(_pointerDownCoordinate.current, currentCoordinate);
    _pointerDownCoordinate.current = currentCoordinate;
    _dragPoints.current.push(currentCoordinate);
  };

  const _handlePointerDown = (ev: PointerEvent) => {
    const currentCoordinate = _getCoordinate(ev);
    _pointerDownCoordinate.current = currentCoordinate;
    _dragPoints.current.push(currentCoordinate);
  };

  const _handlePointerUp = (ev: PointerEvent) => {
    config?.onPointerClick?.(_getCoordinate(ev));
    _handlePointerLeave();
  };

  const _handlePointerLeave = () => {
    if (_isDragging.current) config?.onPointerDragEnd?.(_dragPoints.current);
    _pointerDownCoordinate.current = undefined;
    _isDragging.current = false;
    _dragPoints.current = [];
  };

  useEffect(() => {
    if (config && !!Object.keys(config).length && elementRef.current) {
      elementRef.current.addEventListener(
        'pointermove',
        _handlePointerMovement
      );
      elementRef.current.addEventListener('pointerdown', _handlePointerDown);
      elementRef.current.addEventListener('pointerup', _handlePointerUp);
      elementRef.current.addEventListener('pointercancel', _handlePointerLeave);
      elementRef.current.addEventListener('pointerleave', _handlePointerLeave);
      elementRef.current.addEventListener('pointerout', _handlePointerLeave);
    }
    return () => {
      elementRef.current?.removeEventListener(
        'pointermove',
        _handlePointerMovement
      );
      elementRef.current?.removeEventListener(
        'pointerdown',
        _handlePointerDown
      );
      elementRef.current?.removeEventListener('pointerup', _handlePointerUp);
      elementRef.current?.removeEventListener(
        'pointercancel',
        _handlePointerLeave
      );
      elementRef.current?.removeEventListener(
        'pointerleave',
        _handlePointerLeave
      );
      elementRef.current?.removeEventListener(
        'pointerout',
        _handlePointerLeave
      );
    };
  }, [config]);
};

export default usePointerTracker;
