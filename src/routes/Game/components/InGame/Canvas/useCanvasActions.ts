import { useCanvas } from '@/contexts/canvas';
import { Coordinate } from '@/types/common';

import { OptionKey } from '../utils';

export interface OptionConfig {
  type?: OptionKey;
  color: string;
}

const useCanvasActions = (optionConfig?: OptionConfig) => {
  const { action } = useCanvas();

  const onPointerDrag = (from: Coordinate, to: Coordinate) => {
    switch (optionConfig?.type) {
      case OptionKey.PENCIL:
        action.line(from, to, optionConfig.color);
        break;
      case OptionKey.ERASER:
      default:
        return;
    }
  };

  const onPointerClick = () => {
    switch (optionConfig?.type) {
      default:
        return;
    }
  };

  return { onPointerDrag, onPointerClick };
};

export default useCanvasActions;
