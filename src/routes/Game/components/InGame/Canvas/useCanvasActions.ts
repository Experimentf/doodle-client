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

  const onPointerDrag = (from: Coordinate, to: Coordinate) => {
    const flooredFrom = floorCoordinate(from);
    const flooredTo = floorCoordinate(to);

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
        break;
    }
  };

  const onPointerDragEnd = async (dragPoints: Array<Coordinate>) => {
    const flooredPoints: Coordinate[] = dragPoints.map(floorCoordinate);
    const canvasAction = convertOptionKeyToCanvasActionKey(optionConfig?.type);
    const canvasOperation: Partial<CanvasOperation> = {
      points: flooredPoints,
      actionType: canvasAction,
      color: optionConfig?.color,
      size: optionConfig?.brushSize,
    };
    if (
      canvasAction !== CanvasAction.LINE &&
      canvasAction !== CanvasAction.ERASE
    )
      return;
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation,
      roomId,
    });
  };

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

    const operationPerformed = performOperation();

    const canvasAction = convertOptionKeyToCanvasActionKey(optionConfig?.type);
    const canvasOperation: Partial<CanvasOperation> = {
      points: [flooredPoint],
      actionType: canvasAction,
      color: optionConfig?.color,
      size: optionConfig?.brushSize,
    };

    if (operationPerformed) {
      await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
        canvasOperation,
        roomId,
      });
    }
  };

  return { onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
