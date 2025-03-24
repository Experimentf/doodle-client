import { useEffect, useRef } from 'react';

import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import useDebounce from '@/hooks/useDebouncedCallback';
import usePointerTracker from '@/hooks/usePointerTracker';
import { CanvasAction } from '@/types/canvas';

import useCanvasActions, { OptionConfig } from './useCanvasActions';

interface CanvasProps {
  optionConfig: OptionConfig;
}

const Canvas = ({ optionConfig }: CanvasProps) => {
  const { ref: canvasRef, drawing } = useCanvas();
  const {
    game: { canvasOperations },
  } = useGame();
  const isMountedRef = useRef(false);
  const pointerConfig = useCanvasActions(optionConfig);
  usePointerTracker(canvasRef, pointerConfig);

  const handleCanvasResize = useDebounce(async () => {
    if (!canvasRef.current) return;

    // Size Handling
    const dpr = window.devicePixelRatio;
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;
    const context = canvasRef.current.getContext('2d');
    if (context) context.scale(dpr, dpr);

    // Drawing Handling
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }], false, false);
    if (isMountedRef.current) await drawing?.reloadOperations();
    else await drawing?.loadOperations(canvasOperations, false);
    isMountedRef.current = true;
  });

  useEffect(() => {
    handleCanvasResize();
    window.addEventListener('resize', handleCanvasResize);
    return () => {
      window.removeEventListener('resize', handleCanvasResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        shapeRendering: 'crispEdges',
      }}
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video`}
    />
  );
};
export default Canvas;
