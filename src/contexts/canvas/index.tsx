import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { Drawing } from '@/utils/classes/drawing';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  drawing?: Drawing;
}

const CanvasContext = createContext<CanvasContextInterface>({
  ref: { current: null },
  drawing: undefined,
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(new Drawing(ref));

  return (
    <CanvasContext.Provider
      value={{
        ref,
        drawing: drawingRef.current,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
export default CanvasProvider;
