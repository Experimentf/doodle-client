import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';

import { convertOptionKeyToCanvasActionKey, OptionKey } from '../utils';

export interface OptionConfig {
  type?: OptionKey;
  color: string;
  brushSize: number;
}

const useCanvasActions = (optionConfig?: OptionConfig) => {
  const { asyncEmitEvent } = useSocket();
  const {
    room: { id: roomId },
  } = useRoom();
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

  const onPointerDragEnd = async (dragPoints: Array<Coordinate>) => {
    const canvasAction = convertOptionKeyToCanvasActionKey(optionConfig?.type);
    const canvasOperation: Partial<CanvasOperation> = {
      points: dragPoints,
      actionType: canvasAction,
      color: optionConfig?.color,
      size: optionConfig?.brushSize,
    };
    pushAsOperation(canvasOperation);
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation,
      roomId,
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
