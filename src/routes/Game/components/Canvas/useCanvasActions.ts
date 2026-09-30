import { useEffect, useRef } from 'react';

import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { floorCoordinate, snapTo45 } from '@/utils/coordinate';
import { getShapePoints, ShapeKind } from '@/utils/shapes';

import { OptionKey } from '../Option/utils';

export interface OptionConfig {
  type?: OptionKey;
  color: string;
  brushSize: number;
  shape?: ShapeKind;
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

// local: draw only on this client (the lobby scratchpad), nothing goes to the server.
const useCanvasActions = (optionConfig?: OptionConfig, local = false) => {
  const { asyncEmitEvent } = useSocket();
  const {
    room: { id: roomId },
  } = useRoom();
  const { drawing } = useCanvas();
  const strokeRef = useRef<PendingStroke>();
  const flushTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Pixel coords, so 45° is measured on screen rather than in normalized (aspect-stretched) space.
  const straightRef = useRef<{ anchor: Coordinate; end: Coordinate }>();
  const shapeRef = useRef<{
    kind: ShapeKind;
    anchor: Coordinate;
    end: Coordinate;
  }>();

  useEffect(() => () => clearTimeout(flushTimerRef.current), []);

  // Entering or leaving the scratchpad: drop any half-drawn stroke so scratch points can't be flushed as a real turn.
  useEffect(() => {
    clearTimeout(flushTimerRef.current);
    flushTimerRef.current = undefined;
    strokeRef.current = undefined;
    straightRef.current = undefined;
    shapeRef.current = undefined;
  }, [local]);

  const _emitCanvasOperation = async (canvasOperation: CanvasOperation) => {
    if (local) return;
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

  // Adds an already-drawn segment's end to the pending stroke.
  const _addToStroke = (
    segment: CanvasOperation,
    from: Coordinate,
    to: Coordinate
  ) => {
    const stroke = strokeRef.current;
    if (stroke) {
      stroke.points.push(to);
      stroke.hasUnsentPoints = true;
    } else {
      strokeRef.current = {
        operation: segment,
        points: [from, to],
        hasUnsentPoints: true,
      };
    }
    _scheduleFlush();
  };

  // Drawn synchronously (not in the next frame) so a straight-line preview snapshot always includes it.
  const _drawSegment = (from: Coordinate, to: Coordinate) => {
    if (!drawing) return;
    const normalizedFrom = drawing.normalizeCoordinate(from);
    const normalizedTo = drawing.normalizeCoordinate(to);
    const segment = _brushOperation([normalizedFrom, normalizedTo]);
    if (!segment) return;
    drawing.loadOperations([segment], false);
    _addToStroke(segment, normalizedFrom, normalizedTo);
  };

  // Replaces the preview with the real line; returns where the line ended (pixel coords).
  const _commitStraightLine = () => {
    const straight = straightRef.current;
    if (!drawing || !straight) return undefined;
    straightRef.current = undefined;
    drawing.endPreview();
    _drawSegment(straight.anchor, straight.end);
    return straight.end;
  };

  const _shapeOperation = (
    kind: ShapeKind,
    anchor: Coordinate,
    end: Coordinate
  ): CanvasOperation | undefined => {
    if (!drawing || !optionConfig) return;
    return {
      actionType: CanvasAction.LINE,
      points: getShapePoints(kind, anchor, end).map(
        drawing.normalizeCoordinate
      ),
      color: optionConfig.color,
      size: drawing.normalizeSize(optionConfig.brushSize),
    };
  };

  // Shapes are previewed while dragging and sent whole on release, as one LINE polyline.
  const _commitShape = () => {
    const shape = shapeRef.current;
    if (!drawing || !shape) return;
    shapeRef.current = undefined;
    drawing.endPreview();
    // A click without dragging draws nothing, so a misclick doesn't leave a dot.
    if (shape.anchor.x === shape.end.x && shape.anchor.y === shape.end.y)
      return;
    const operation = _shapeOperation(shape.kind, shape.anchor, shape.end);
    if (!operation) return;
    drawing.loadOperations([operation], false);
    _emitCanvasOperation(operation);
  };

  const onPointerDown = (point: Coordinate) => {
    if (!drawing) return;
    straightRef.current = undefined;
    if (optionConfig?.type === OptionKey.SHAPE) {
      _flushStroke(true);
      if (!optionConfig.shape) return;
      const anchor = floorCoordinate(point);
      shapeRef.current = { kind: optionConfig.shape, anchor, end: anchor };
      drawing.beginPreview();
      return;
    }
    const normalizedPoint = drawing.normalizeCoordinate(point);
    const operation = _brushOperation([normalizedPoint]);
    if (!operation) return;
    _flushStroke(true);
    drawing.loadOperations([operation], false);
    strokeRef.current = {
      operation,
      points: [normalizedPoint],
      hasUnsentPoints: true,
    };
    _scheduleFlush();
  };

  const onPointerDrag = (
    from: Coordinate,
    to: Coordinate,
    ev: PointerEvent
  ) => {
    if (!drawing) return;
    const shape = shapeRef.current;
    if (shape) {
      // Ctrl/Cmd snaps the line shape to 45°, same as a freehand straight line.
      shape.end =
        shape.kind === ShapeKind.LINE && (ev.ctrlKey || ev.metaKey)
          ? snapTo45(shape.anchor, to)
          : floorCoordinate(to);
      const preview = _shapeOperation(shape.kind, shape.anchor, shape.end);
      if (preview) drawing.preview(preview);
      return;
    }
    if (!_brushOperation([])) return;
    // Ctrl (Cmd on Mac) held: straight line from where it was pressed, snapped to 45°.
    if (ev.ctrlKey || ev.metaKey) {
      if (!straightRef.current) {
        const anchor = floorCoordinate(from);
        straightRef.current = { anchor, end: anchor };
        drawing.beginPreview();
      }
      const straight = straightRef.current;
      straight.end = snapTo45(straight.anchor, to);
      const preview = _brushOperation([
        drawing.normalizeCoordinate(straight.anchor),
        drawing.normalizeCoordinate(straight.end),
      ]);
      if (preview) drawing.preview(preview);
      return;
    }
    // Modifier released mid-drag: keep the line and continue freehand from its end.
    const lineEnd = _commitStraightLine();
    _drawSegment(lineEnd ?? from, to);
  };

  const onPointerDragEnd = () => {
    _commitShape();
    _commitStraightLine();
    _flushStroke(true);
  };

  const onPointerClick = (point: Coordinate) => {
    _commitShape();
    _commitStraightLine();
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
