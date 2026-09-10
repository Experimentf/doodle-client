import { useEffect, useRef } from 'react';

import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import usePointerTracker from '@/hooks/usePointerTracker';
import { CanvasAction } from '@/types/canvas';
import { GameStatus } from '@/types/models/game';
import { toneRisingChime } from '@/utils/sounds/toneRisingChime';

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
  const pointerConfig = useCanvasActions(optionConfig);
  usePointerTracker(canvasRef, pointerConfig);

  const handleCanvasResize = async () => {
    if (!canvasRef.current) return;

    // Size Handling
    // Cap the backing-store resolution at 2x - beyond that (common on
    // higher-end phones, which report 3x) the extra pixels are barely
    // visible but meaningfully increase the cost of every fill operation,
    // since it reads/writes the full canvas buffer.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;

    // Drawing Handlinga
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }], false, false);
    if (isMountedRef.current) await drawing?.reloadOperations();
    else await drawing?.loadOperations(canvasOperations, false);
    isMountedRef.current = true;
  };

  useEffect(() => {
    handleCanvasResize();
    window.addEventListener('resize', handleCanvasResize);
    return () => {
      window.removeEventListener('resize', handleCanvasResize);
    };
  }, []);

  useEffect(() => {
    toneRisingChime();
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
