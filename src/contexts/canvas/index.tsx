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

  const line: CanvasContextInterface['action']['line'] = (from, to, color) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const fill = () => {};

  const erase = () => {};

  const clear = () => {};

  const undo = () => {};

  const redo = () => {};

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
