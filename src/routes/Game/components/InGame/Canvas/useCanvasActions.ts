import { useCanvas } from '@/contexts/canvas';
import { Coordinate } from '@/types/common';

import { convertOptionKeyToCanvasActionKey, OptionKey } from '../utils';

export interface OptionConfig {
  type?: OptionKey;
  color: string;
  brushSize: number;
}

const useCanvasActions = (optionConfig?: OptionConfig) => {
  const { action, pushAsOperation } = useCanvas();

  const onPointerDrag = (from: Coordinate, to: Coordinate) => {
    switch (optionConfig?.type) {
      case OptionKey.PENCIL:
        action.line(from, to, optionConfig.color, optionConfig.brushSize);
        break;
      case OptionKey.ERASER:
        action.erase(from, to, optionConfig.brushSize);
        break;
      default:
        break;
    }
  };

  const onPointerDragEnd = (dragPoints: Array<Coordinate>) => {
    const canvasAction = convertOptionKeyToCanvasActionKey(optionConfig?.type);
    pushAsOperation({
      points: dragPoints,
      actionType: canvasAction,
      color: optionConfig?.color,
      size: optionConfig?.brushSize,
    });
  };

  const onPointerClick = () => {
    switch (optionConfig?.type) {
      default:
        break;
    }
  };

  return { onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
