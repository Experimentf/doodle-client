/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { Coordinate } from '@/types/common';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  action: {
    line: (from: Coordinate, to: Coordinate, color: string) => void;
    fill: () => void;
    erase: () => void;
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
    fn: T
  ) => {
    return (...args: Parameters<T>) => {
      if (animationFrameID.current)
        cancelAnimationFrame(animationFrameID.current);
      animationFrameID.current = requestAnimationFrame(() => {
        fn(...args);
      });
    };
  };

  const line: CanvasContextInterface['action']['line'] =
    withRequestAnimationFrame((from, to, color) => {
      const ctx = ref.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });

  const fill = withRequestAnimationFrame(() => {});

  const erase = withRequestAnimationFrame(() => {});

  const clear = withRequestAnimationFrame(() => {});

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
