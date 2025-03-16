import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasAction } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import Stack from '@/utils/stack';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  action: {
    [CanvasAction.LINE]: (
      from: Coordinate,
      to: Coordinate,
      color: string,
      size: number
    ) => void;
    [CanvasAction.FILL]: () => void;
    [CanvasAction.ERASE]: (
      from: Coordinate,
      to: Coordinate,
      size: number
    ) => void;
    [CanvasAction.CLEAR]: () => void;
    [CanvasAction.UNDO]: () => void;
    [CanvasAction.REDO]: () => void;
  };
  pushAsOperation: () => void;
  isActionAllowed: Partial<Record<CanvasAction, boolean>>;
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
  isActionAllowed: {},
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const animationFrameID = useRef<number>();
  const operationsStack = useRef(new Stack<ImageData>());
  const [isActionAllowed, setIsActionAllowed] = useState<
    CanvasContextInterface['isActionAllowed']
  >({});

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
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    ctx.fillStyle = DARK_BOARD_GREEN_HEX;
    ctx.fillRect(0, 0, ref.current.width, ref.current.height);
    pushAsOperation();
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
    recheckAllowedActions();
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
    recheckAllowedActions();
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
    recheckAllowedActions();
  };

  const recheckAllowedActions = () => {
    setIsActionAllowed((prev) => ({
      ...prev,
      undo: operationsStack.current.size > 1,
      redo: operationsStack.current.isExtended(),
    }));
  };

  return (
    <CanvasContext.Provider
      value={{
        ref,
        action: { line, fill, erase, clear, undo, redo },
        pushAsOperation,
        isActionAllowed,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
