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

// Paths from react-icons (FaFill + the drip of FaFillDrip, the toolbar's Fill icon) so the drip can take the fill color.
const BUCKET_PATH =
  'M502.63 217.06L294.94 9.37C288.69 3.12 280.5 0 272.31 0s-16.38 3.12-22.62 9.37l-81.58 81.58L81.93 4.77c-6.24-6.25-16.38-6.25-22.62 0L36.69 27.38c-6.24 6.25-6.24 16.38 0 22.63l86.19 86.18-94.76 94.76c-37.49 37.49-37.49 98.26 0 135.75l117.19 117.19c18.75 18.74 43.31 28.12 67.87 28.12 24.57 0 49.13-9.37 67.88-28.12l221.57-221.57c12.49-12.5 12.49-32.76 0-45.26zm-116.22 70.97H65.93c1.36-3.84 3.57-7.98 7.43-11.83l13.15-13.15 81.61-81.61 58.61 58.6c12.49 12.49 32.75 12.49 45.24 0 12.49-12.49 12.49-32.75 0-45.24l-58.61-58.6 58.95-58.95 162.45 162.44-48.35 48.34z';
const DRIP_PATH =
  'M512 320s-64 92.65-64 128c0 35.35 28.66 64 64 64s64-28.65 64-64-64-128-64-128z';

// 648-unit viewBox at 24px (27 units per px), offset so the drip's tip (512, 512) lands on the integer hotspot (20, 21).
const getFillCursor = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-28 -55 648 648"><g stroke="black" stroke-opacity="0.6" stroke-width="60" stroke-linejoin="round" fill="none"><path d="${BUCKET_PATH}"/><path d="${DRIP_PATH}"/></g><path d="${BUCKET_PATH}" fill="white"/><path d="${DRIP_PATH}" fill="${color}" stroke="white" stroke-width="20"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(
    svg
  )}") 20 21, crosshair`;
};

interface CanvasProps {
  optionConfig?: OptionConfig;
  canDraw?: boolean;
}

const Canvas = ({ optionConfig, canDraw = false }: CanvasProps) => {
  const { ref: canvasRef, drawing } = useCanvas();
  const {
    game: { canvasOperations, status },
  } = useGame();
  const isMountedRef = useRef(false);
  const lastSizeRef = useRef<{ width: number; height: number } | null>(null);
  const pointerConfig = useCanvasActions(optionConfig);
  // No listeners at all for non-drawers, whatever tool they have selected.
  usePointerTracker(canvasRef, canDraw ? pointerConfig : undefined);

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
    if (type === OptionKey.FILL)
      return getFillCursor(optionConfig?.color ?? '#ffffff');
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
