import React, { useRef } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const InGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="w-full">
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
        className="bg-dark-board-green rounded-xl w-full h-full"
      />
    </div>
  );
};

export default InGame;
