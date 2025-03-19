import { MutableRefObject, RefObject } from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { getPixelHexCode } from '@/utils/canvas';

import Stack from '../stack';
import { DrawingInterface } from './interface';

export class Drawing implements DrawingInterface {
  private _ref: RefObject<HTMLCanvasElement | null>;
  private _animationFrameId: MutableRefObject<number | undefined>;
  private _drawingHistory = new Stack<ImageData>();

  constructor(
    ref: RefObject<HTMLCanvasElement | null>,
    animationFrameId: MutableRefObject<number | undefined>
  ) {
    this._ref = ref;
    this._animationFrameId = animationFrameId;
  }

  // PUBLIC METHODS

  line: DrawingInterface['line'] = (from, to, color, size) => {
    const ctx = this._context;
    if (!ctx) return;
    const createLine = () => {
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    };
    this._withRequestAnimationFrame(createLine)();
  };

  fill: DrawingInterface['fill'] = (point, color) => {
    const ctx = this._context;
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    const maxWidth = ref.current.width;
    const maxHeight = ref.current.height;

    const fillColor = () => {
      const imageData = ctx.getImageData(0, 0, maxWidth, maxHeight);
      const previousColor = getPixelHexCode(ctx, point);

      const fillWorker = new Worker(
        new URL('../../../workers/canvas/fill.worker', import.meta.url)
      );
      fillWorker.postMessage({
        imageData,
        point,
        previousColor,
        newColor: color,
        maxWidth,
        maxHeight,
      });
      fillWorker.onmessage = (event: MessageEvent<ImageData>) => {
        const newImageData = event.data;
        ctx.putImageData(newImageData, 0, 0);
      };
    };
    this._withRequestAnimationFrame(fillColor)();
  };

  erase: DrawingInterface['erase'] = (from, to, size) => {
    this.line(from, to, DARK_BOARD_GREEN_HEX, size);
  };

  clear: DrawingInterface['clear'] = () => {
    const ctx = this._context;
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    const maxWidth = ref.current.width;
    const maxHeight = ref.current.height;

    const clearDrawing = () => {
      ctx.clearRect(0, 0, maxWidth, maxHeight);
      ctx.fillStyle = DARK_BOARD_GREEN_HEX;
      ctx.fillRect(0, 0, maxWidth, maxHeight);
    };
    this._withRequestAnimationFrame(clearDrawing)();
  };

  batchLine: DrawingInterface['batchLine'] = (points, color, size) => {
    const nPoints = points.length;
    const ctx = this._context;
    if (nPoints === 0 || !ctx) return;

    const drawSequentially = () => {
      let currentIndex = 0;
      const drawNextLine = () => {
        if (currentIndex >= nPoints - 1) return;
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(points[currentIndex].x, points[currentIndex].y);
        ctx.lineTo(points[currentIndex + 1].x, points[currentIndex + 1].y);
        ctx.stroke();
        currentIndex++;
        requestAnimationFrame(drawNextLine);
      };
      drawNextLine();
    };
    this._withRequestAnimationFrame(drawSequentially)();
  };

  batchErase: DrawingInterface['batchErase'] = (points, size) => {
    const nPoints = points.length;
    const ctx = this._context;
    if (nPoints === 0 || !ctx) return;

    const eraseSequentially = () => {
      let currentIndex = 0;
      const eraseNextLine = () => {
        if (currentIndex >= nPoints - 1) return;
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = DARK_BOARD_GREEN_HEX;
        ctx.moveTo(points[currentIndex].x, points[currentIndex].y);
        ctx.lineTo(points[currentIndex + 1].x, points[currentIndex + 1].y);
        ctx.stroke();
        currentIndex++;
        requestAnimationFrame(eraseNextLine);
      };
      eraseNextLine();
    };
    this._withRequestAnimationFrame(eraseSequentially)();
  };

  // PRIVATE METHODS

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _withRequestAnimationFrame = <T extends (...args: any[]) => void>(
    fn: (...args: Parameters<T>) => void
  ) => {
    return (...args: Parameters<T>) => {
      this._animationFrameId.current = requestAnimationFrame(() => {
        fn(...args);
      });
    };
  };

  private get _context() {
    return this._ref.current?.getContext('2d');
  }
}
