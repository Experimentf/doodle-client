import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';

import { convertOptionKeyToCanvasActionKey, OptionKey } from '../Option/utils';

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
    if (!drawing) return;
    const flooredFrom = drawing.normalizeCoordinate(from);
    const flooredTo = drawing.normalizeCoordinate(to);
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
    if (!drawing) return;
    const flooredPoint: Coordinate = drawing?.normalizeCoordinate(point);
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

  if (!optionConfig) return undefined;
  return { onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
