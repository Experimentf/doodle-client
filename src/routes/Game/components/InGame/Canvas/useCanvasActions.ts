import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { floorCoordinate } from '@/utils/coordinate';

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
  const { drawing } = useCanvas();

  const _emitCanvasOperation = async (points: Coordinate[]) => {
    const canvasAction = convertOptionKeyToCanvasActionKey(optionConfig?.type);
    const canvasOperation: Partial<CanvasOperation> = {
      points,
      actionType: canvasAction,
      color: optionConfig?.color,
      size: optionConfig?.brushSize,
    };
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation,
      roomId,
    });
  };

  const onPointerDrag = async (from: Coordinate, to: Coordinate) => {
    const flooredFrom = floorCoordinate(from);
    const flooredTo = floorCoordinate(to);

    const performOperation = () => {
      switch (optionConfig?.type) {
        case OptionKey.PENCIL:
          drawing?.line(
            flooredFrom,
            flooredTo,
            optionConfig.color,
            optionConfig.brushSize
          );
          break;
        case OptionKey.ERASER:
          drawing?.erase(flooredFrom, flooredTo, optionConfig.brushSize);
          break;
        default:
          return false;
      }
      return true;
    };

    const isOperationDone = performOperation();
    if (isOperationDone) {
      await _emitCanvasOperation([flooredFrom, flooredTo]);
    }
  };

  const onPointerDragEnd = () => {};

  const onPointerClick = async (point: Coordinate) => {
    const flooredPoint: Coordinate = {
      x: Math.floor(point.x),
      y: Math.floor(point.y),
    };

    const performOperation = () => {
      switch (optionConfig?.type) {
        case OptionKey.FILL:
          drawing?.fill(flooredPoint, optionConfig.color);
          break;
        default:
          return false;
      }
      return true;
    };

    const isOperationDone = performOperation();
    if (isOperationDone) {
      await _emitCanvasOperation([flooredPoint]);
    }
  };

  return { onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
