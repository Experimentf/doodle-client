import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react';

import type { OptionConfig } from '@/routes/Game/components/Canvas/useCanvasActions';
import { OptionKey } from '@/routes/Game/components/Option/utils';
import { GameStatus } from '@/types/models/game';
import { Drawing } from '@/utils/classes/drawing';

const DEFAULT_OPTION_CONFIG: OptionConfig = {
  color: '#ffffff',
  type: OptionKey.PENCIL,
  brushSize: 5,
};

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  drawing?: Drawing;
  // Drawer's tool, colour and brush size
  optionConfig: OptionConfig;
  setOptionConfig: Dispatch<SetStateAction<OptionConfig>>;
  // Last game status the canvas reacted to, so a remounted Canvas doesn't reset or replay it
  handledStatusRef: MutableRefObject<GameStatus | undefined>;
}

const CanvasContext = createContext<CanvasContextInterface>({
  ref: { current: null },
  drawing: undefined,
  optionConfig: DEFAULT_OPTION_CONFIG,
  setOptionConfig: () => {},
  handledStatusRef: { current: undefined },
});

// Mounted once above both game layouts, so crossing the lg breakpoint keeps the stroke history
// (including live strokes) and the drawer's tool selection.
const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(new Drawing(ref));
  const [optionConfig, setOptionConfig] = useState<OptionConfig>(
    DEFAULT_OPTION_CONFIG
  );
  const handledStatusRef = useRef<GameStatus>();

  return (
    <CanvasContext.Provider
      value={{
        ref,
        drawing: drawingRef.current,
        optionConfig,
        setOptionConfig,
        handledStatusRef,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
export default CanvasProvider;
