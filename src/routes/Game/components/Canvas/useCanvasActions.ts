import { useEffect, useRef } from 'react';

import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';

import { OptionKey } from '../Option/utils';

export interface OptionConfig {
  type?: OptionKey;
  color: string;
  brushSize: number;
}

// Strokes render locally at once but go to the server in batches instead of one message per pointer move.
const STROKE_FLUSH_MS = 40;

interface PendingStroke {
  operation: CanvasOperation;
  // Separate from operation.points so the loaded operation in local history isn't mutated.
  // After a flush, points[0] is the previous batch's tail, kept only to connect the next segment.
  points: Coordinate[];
  hasUnsentPoints: boolean;
}

const useCanvasActions = (optionConfig?: OptionConfig) => {
  const { asyncEmitEvent } = useSocket();
  const {
    room: { id: roomId },
  } = useRoom();
  const { drawing } = useCanvas();
  const strokeRef = useRef<PendingStroke>();
  const flushTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(flushTimerRef.current), []);

  const _emitCanvasOperation = async (canvasOperation: CanvasOperation) => {
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation,
      roomId,
    });
  };

  const _flushStroke = (endStroke = false) => {
    clearTimeout(flushTimerRef.current);
    flushTimerRef.current = undefined;
    const stroke = strokeRef.current;
    if (!stroke) return;
    const { operation, points, hasUnsentPoints } = stroke;
    if (hasUnsentPoints) _emitCanvasOperation({ ...operation, points });
    strokeRef.current = endStroke
      ? undefined
      : {
          operation,
          points: [points[points.length - 1]],
          hasUnsentPoints: false,
        };
  };

  const _scheduleFlush = () => {
    if (!flushTimerRef.current)
      flushTimerRef.current = setTimeout(_flushStroke, STROKE_FLUSH_MS);
  };

  const _brushOperation = (
    points: Coordinate[]
  ): CanvasOperation | undefined => {
    if (!drawing) return;
    const size = optionConfig?.brushSize
      ? drawing.normalizeSize(optionConfig.brushSize)
      : undefined;
    switch (optionConfig?.type) {
      case OptionKey.PENCIL:
        return {
          actionType: CanvasAction.LINE,
          points,
          color: optionConfig.color,
          size,
        };
      case OptionKey.ERASER:
        return { actionType: CanvasAction.ERASE, points, size };
      default:
        return undefined;
    }
  };

  const onPointerDown = (point: Coordinate) => {
    if (!drawing) return;
    const normalizedPoint = drawing.normalizeCoordinate(point);
    const operation = _brushOperation([normalizedPoint]);
    if (!operation) return;
    _flushStroke(true);
    drawing.loadOperations([operation]);
    strokeRef.current = {
      operation,
      points: [normalizedPoint],
      hasUnsentPoints: true,
    };
    _scheduleFlush();
  };

  const onPointerDrag = (from: Coordinate, to: Coordinate) => {
    if (!drawing) return;
    const normalizedFrom = drawing.normalizeCoordinate(from);
    const normalizedTo = drawing.normalizeCoordinate(to);
    const segment = _brushOperation([normalizedFrom, normalizedTo]);
    if (!segment) return;
    drawing.loadOperations([segment]);
    const stroke = strokeRef.current;
    if (stroke) {
      stroke.points.push(normalizedTo);
      stroke.hasUnsentPoints = true;
    } else {
      strokeRef.current = {
        operation: segment,
        points: [normalizedFrom, normalizedTo],
        hasUnsentPoints: true,
      };
    }
    _scheduleFlush();
  };

  const onPointerDragEnd = () => _flushStroke(true);

  const onPointerClick = (point: Coordinate) => {
    _flushStroke(true);
    if (!drawing || optionConfig?.type !== OptionKey.FILL) return;
    const operation: CanvasOperation = {
      actionType: CanvasAction.FILL,
      points: [drawing.normalizeCoordinate(point)],
      color: optionConfig.color,
    };
    drawing.loadOperations([operation]);
    _emitCanvasOperation(operation);
  };

  if (!optionConfig) return undefined;
  return { onPointerDown, onPointerDrag, onPointerDragEnd, onPointerClick };
};

export default useCanvasActions;
