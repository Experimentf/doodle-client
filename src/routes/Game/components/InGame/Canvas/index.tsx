import { useEffect } from 'react';

import { useCanvas } from '@/contexts/canvas';

const Canvas = () => {
  const { ref: canvasRef } = useCanvas();

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`bg-dark-board-green rounded-xl w-full h-full aspect-video`}
    />
  );
};
export default Canvas;
