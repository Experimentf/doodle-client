import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { Coordinate } from '@/types/common';
import Stack from '@/utils/stack';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  action: {
    line: (
      from: Coordinate,
      to: Coordinate,
      color: string,
      size: number
    ) => void;
    fill: () => void;
    erase: (from: Coordinate, to: Coordinate, size: number) => void;
    clear: () => void;
    undo: () => void;
    redo: () => void;
  };
  pushAsOperation: () => void;
}

const CanvasContext = createContext<CanvasContextInterface>({
  ref: { current: null },
  action: {
    line: () => {},
    fill: () => {},
    erase: () => {},
    clear: () => {},
    undo: () => {},
    redo: () => {},
  },
  pushAsOperation: () => {},
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const animationFrameID = useRef<number>();
  const operationsStack = useRef(new Stack<ImageData>());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withRequestAnimationFrame = <T extends (...args: any[]) => void>(
    fn: (...args: Parameters<T>) => void
  ) => {
    return (...args: Parameters<T>) => {
      if (animationFrameID.current)
        cancelAnimationFrame(animationFrameID.current);
      animationFrameID.current = requestAnimationFrame(() => {
        fn(...args);
      });
    };
  };

  const line = withRequestAnimationFrame<
    CanvasContextInterface['action']['line']
  >((from, to, color, size) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  const fill = withRequestAnimationFrame<
    CanvasContextInterface['action']['fill']
  >(() => {});

  const erase = withRequestAnimationFrame<
    CanvasContextInterface['action']['erase']
  >((from, to, size) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = DARK_BOARD_GREEN_HEX;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  const clear = withRequestAnimationFrame<
    CanvasContextInterface['action']['clear']
  >(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    pushAsOperation();
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    ctx.fillStyle = DARK_BOARD_GREEN_HEX;
    ctx.fillRect(0, 0, ref.current.width, ref.current.height);
  });

  const undo = withRequestAnimationFrame<
    CanvasContextInterface['action']['undo']
  >(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    const lastImageData = operationsStack.current.top;
    if (!lastImageData) {
      clear();
      return;
    }
    operationsStack.current.pop();
    const newImageData = operationsStack.current.top;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    if (newImageData) ctx.putImageData(newImageData, 0, 0);
  });

  const redo = withRequestAnimationFrame<
    CanvasContextInterface['action']['redo']
  >(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    const isUnpopped = operationsStack.current.unpop();
    if (!isUnpopped) return;
    const newImageData = operationsStack.current.top;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    if (newImageData) ctx.putImageData(newImageData, 0, 0);
  });

  const pushAsOperation = () => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    const imageData = ctx.getImageData(
      0,
      0,
      ref.current.width,
      ref.current.height
    );
    operationsStack.current.push(imageData);
  };

  return (
    <CanvasContext.Provider
      value={{
        ref,
        action: { line, fill, erase, clear, undo, redo },
        pushAsOperation,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
