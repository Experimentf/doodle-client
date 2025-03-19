import { useEffect } from 'react';

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
  const pointerConfig = useCanvasActions(optionConfig);
  usePointerTracker(canvasRef, pointerConfig);

  const handleCanvasResize = useDebounce(async () => {
    if (!canvasRef.current) return;
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }], false);
    await drawing?.loadOperations(canvasOperations, false);
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
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video`}
    />
  );
};
export default Canvas;
