/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { Coordinate } from '@/types/common';

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

  const fill = withRequestAnimationFrame(() => {});

  const erase = withRequestAnimationFrame((from, to, size) => {
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

  const clear = withRequestAnimationFrame(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
  });

  const undo = withRequestAnimationFrame(() => {});

  const redo = withRequestAnimationFrame(() => {});

  return (
    <CanvasContext.Provider
      value={{ ref, action: { line, fill, erase, clear, undo, redo } }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
