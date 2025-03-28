import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
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
    if (!canvasAction) return;
    const canvasOperation: CanvasOperation = {
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
          drawing?.loadOperations([
            {
              actionType: CanvasAction.LINE,
              points: [flooredFrom, flooredTo],
              color: optionConfig.color,
              size: optionConfig.brushSize,
            },
          ]);
          break;
        case OptionKey.ERASER:
          drawing?.loadOperations([
            {
              actionType: CanvasAction.ERASE,
              points: [flooredFrom, flooredTo],
              size: optionConfig.brushSize,
            },
          ]);
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
          drawing?.loadOperations([
            {
              actionType: CanvasAction.FILL,
              points: [flooredPoint],
              color: optionConfig.color,
            },
          ]);
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
