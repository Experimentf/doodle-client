import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasOperation, CanvasOperationType } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { getPixelHexCode } from '@/utils/canvas';
import { getMidPoint } from '@/utils/coordinate';
import Stack from '@/utils/stack';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  action: {
    line: (
      from: Coordinate,
      to: Coordinate,
      color: string,
      size: number,
      asOperation?: boolean
    ) => void;
    fill: () => void;
    erase: (
      from: Coordinate,
      to: Coordinate,
      size: number,
      asOperation?: boolean
    ) => void;
    clear: (asOperation?: boolean) => void;
    undo: () => void;
    redo: () => void;
  };
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
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const animationFrameID = useRef<number>();
  const operationsStack = useRef(new Stack<CanvasOperation>());

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
  >((from, to, color, size, asOperation) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    if (asOperation) {
      operationsStack.current.push({
        type: CanvasOperationType.LINE,
        prevColor: getPixelHexCode(ctx, getMidPoint(from, to)),
        color,
        size,
        from,
        to,
      });
    }
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
  >((from, to, size, asOperation) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    if (asOperation) {
      operationsStack.current.push({
        type: CanvasOperationType.ERASE,
        prevColor: getPixelHexCode(ctx, getMidPoint(from, to)),
        color: DARK_BOARD_GREEN_HEX,
        size,
        from,
        to,
      });
    }
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
  >((asOperation) => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    if (asOperation) {
      operationsStack.current.push({
        type: CanvasOperationType.LINE,
        imageData: ctx.getImageData(
          0,
          0,
          ref.current.width,
          ref.current.height
        ),
      });
    }
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    ctx.fillStyle = DARK_BOARD_GREEN_HEX;
    ctx.fillRect(0, 0, ref.current.width, ref.current.height);
  });

  const undo = withRequestAnimationFrame<
    CanvasContextInterface['action']['undo']
  >(() => {});

  const redo = withRequestAnimationFrame<
    CanvasContextInterface['action']['redo']
  >(() => {});

  return (
    <CanvasContext.Provider
      value={{
        ref,
        action: { line, fill, erase, clear, undo, redo },
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
