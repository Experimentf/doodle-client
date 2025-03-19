import { useEffect } from 'react';

import { useCanvas } from '@/contexts/canvas';
import usePointerTracker from '@/hooks/usePointerTracker';

import useCanvasActions, { OptionConfig } from './useCanvasActions';

interface CanvasProps {
  optionConfig: OptionConfig;
}

const Canvas = ({ optionConfig }: CanvasProps) => {
  const { ref: canvasRef, drawing } = useCanvas();
  const pointerConfig = useCanvasActions(optionConfig);
  usePointerTracker(canvasRef, pointerConfig);

  const handleCanvasResize = () => {
    if (!canvasRef.current) return;
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    drawing?.clear();
  };

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
