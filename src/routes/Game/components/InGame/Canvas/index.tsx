import { useEffect, useRef } from 'react';

import useCanvasActions from '@/hooks/useCanvasActions';
import usePointerMovement from '@/hooks/usePointerMovement';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = canvasRef.current?.getContext('2d');
  const {} = usePointerMovement(canvasRef);
  const {} = useCanvasActions(canvasContext);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video cursor-none`}
    />
  );
};
export default Canvas;
