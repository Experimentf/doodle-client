import { useEffect, useMemo, useRef } from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import usePointerTracker from '@/hooks/usePointerTracker';
import { CanvasAction } from '@/types/canvas';
import { GameStatus } from '@/types/models/game';
import { getCanvasPixelRatio } from '@/utils/canvas';
import { playGameStatusSound } from '@/utils/sounds/gameStatusSound';

import { OptionKey } from '../Option/utils';
import useCanvasActions, { OptionConfig } from './useCanvasActions';

// Dark halo around a white ring keeps the outline visible on both the board and white strokes.
const getBrushCursor = (brushSize: number, color: string) => {
  const diameter = Math.max(brushSize / getCanvasPixelRatio(), 4);
  // Even box so the hotspot is an integer - a fractional one invalidates the whole cursor rule.
  const box = 2 * Math.ceil((diameter + 4) / 2);
  const c = box / 2;
  const r = diameter / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}"><circle cx="${c}" cy="${c}" r="${r}" fill="${color}" stroke="black" stroke-opacity="0.6" stroke-width="3"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="white" stroke-width="1"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(
    svg
  )}") ${c} ${c}, crosshair`;
};

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
    const dpr = getCanvasPixelRatio();
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

  const cursor = useMemo(() => {
    const type = optionConfig?.type;
    if (type !== OptionKey.PENCIL && type !== OptionKey.ERASER)
      return undefined;
    const color =
      type === OptionKey.ERASER
        ? DARK_BOARD_GREEN_HEX
        : optionConfig?.color ?? '#ffffff';
    return getBrushCursor(optionConfig?.brushSize ?? 0, color);
  }, [optionConfig?.type, optionConfig?.brushSize, optionConfig?.color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ cursor }}
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video touch-none ${
        status === GameStatus.GAME
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
    />
  );
};
export default Canvas;
