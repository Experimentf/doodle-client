import { useEffect, useRef } from 'react';

import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import usePointerTracker from '@/hooks/usePointerTracker';
import { CanvasAction } from '@/types/canvas';
import { GameStatus } from '@/types/models/game';
import { playGameStatusSound } from '@/utils/sounds/gameStatusSound';

import useCanvasActions, { OptionConfig } from './useCanvasActions';

interface CanvasProps {
  optionConfig?: OptionConfig;
}

const Canvas = ({ optionConfig }: CanvasProps) => {
  const { ref: canvasRef, drawing } = useCanvas();
  const {
    game: { canvasOperations, status },
  } = useGame();
  const isMountedRef = useRef(false);
  const lastSizeRef = useRef<{ width: number; height: number } | null>(null);
  const pointerConfig = useCanvasActions(optionConfig);
  usePointerTracker(canvasRef, pointerConfig);

  const handleCanvasResize = async () => {
    if (!canvasRef.current) return;

    // Size Handling
    // Cap backing-store resolution at 2x - 3x (common on phones) costs fill
    // performance for barely-visible sharpness gains.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvasRef.current.getBoundingClientRect();
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);

    // Mobile keyboards fire `resize` without the canvas's size actually
    // changing; skip so we don't reflow the page and re-trigger scroll.
    if (
      lastSizeRef.current?.width === width &&
      lastSizeRef.current?.height === height
    ) {
      return;
    }
    lastSizeRef.current = { width, height };

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Drawing Handlinga
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }], false, false);
    if (isMountedRef.current) await drawing?.reloadOperations();
    else await drawing?.loadOperations(canvasOperations, false);
    isMountedRef.current = true;
  };

  useEffect(() => {
    // Deferred a frame so this measures after the browser's own layout reflow (e.g. dvh recalculation on keyboard open) has applied.
    const scheduleCanvasResize = () => {
      requestAnimationFrame(handleCanvasResize);
    };

    scheduleCanvasResize();
    window.addEventListener('resize', scheduleCanvasResize);
    // The container resizes for the on-screen keyboard via the CSS `dvh` unit, which doesn't reliably fire a `resize` event on `window` (notably iOS Safari) - needs its own listener to stay in sync.
    window.visualViewport?.addEventListener('resize', scheduleCanvasResize);
    return () => {
      window.removeEventListener('resize', scheduleCanvasResize);
      window.visualViewport?.removeEventListener(
        'resize',
        scheduleCanvasResize
      );
    };
  }, []);

  useEffect(() => {
    playGameStatusSound(status);
    drawing?.reset();
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video touch-none ${
        status === GameStatus.GAME
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
    />
  );
};
export default Canvas;
