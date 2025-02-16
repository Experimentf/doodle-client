import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface CanvasContextInterface {
  canvasContext: CanvasRenderingContext2D | null;
}

const CanvasContext = createContext<CanvasContextInterface>({
  canvasContext: null,
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const drawLine = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    setContext(canvasRef.current?.getContext('2d'));
    drawLine(canvasRef.current.getContext('2d'));
  }, []);

  return (
    <CanvasContext.Provider value={{ canvasContext: context }}>
      <div className="w-full relative">
        <canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={canvasRef}
          className="bg-dark-board-green rounded-xl w-full h-full aspect-video"
        />
        {children}
      </div>
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
