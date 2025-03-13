import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface CanvasContextInterface {
  setCursorVisibility: Dispatch<SetStateAction<boolean>>;
}

const CanvasContext = createContext<CanvasContextInterface>({
  setCursorVisibility: () => {},
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const [cursorVisibility, setCursorVisibility] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = canvasRef.current?.getContext('2d');

  const drawLine = () => {
    if (!canvasContext) return;
    canvasContext.beginPath();
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvasContext.stroke();
  };

  useEffect(() => {
    drawLine();
  }, []);

  return (
    <CanvasContext.Provider value={{ setCursorVisibility }}>
      <div className="w-full relative">
        <canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={canvasRef}
          className={`bg-dark-board-green rounded-xl w-full h-full aspect-video ${
            cursorVisibility ? 'cursor-default' : 'cursor-none'
          }`}
        />
        {children}
      </div>
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
