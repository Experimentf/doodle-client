import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
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
  const { action } = useCanvas();

  const onPointerDrag = (from: Coordinate, to: Coordinate) => {
    const flooredFrom: Coordinate = {
      x: Math.floor(from.x),
      y: Math.floor(from.y),
    };
    const flooredTo: Coordinate = {
      x: Math.floor(to.x),
      y: Math.floor(to.y),
    };

    switch (optionConfig?.type) {
      case OptionKey.PENCIL:
        action.line(
          flooredFrom,
          flooredTo,
          optionConfig.color,
          optionConfig.brushSize
        );
        break;
      case OptionKey.ERASER:
        action.erase(flooredFrom, flooredTo, optionConfig.brushSize);
        break;
      default:
        break;
    }
  };

  const onPointerDragEnd = async (dragPoints: Array<Coordinate>) => {
    const flooredPoints: Coordinate[] = dragPoints.map((point) => ({
      x: Math.floor(point.x),
      y: Math.floor(point.y),
    }));
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

  const onPointerClick = (point: Coordinate) => {
    const flooredPoint: Coordinate = {
      x: Math.floor(point.x),
      y: Math.floor(point.y),
    };
    switch (optionConfig?.type) {
      case OptionKey.FILL:
        action.fill(flooredPoint, optionConfig.color, optionConfig.brushSize);
        break;
      default:
        break;
    }
  };

  return { onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
