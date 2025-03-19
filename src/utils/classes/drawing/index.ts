import { RefObject } from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { getPixelHexCode } from '@/utils/colors';

import Stack from '../stack';
import { DrawingInterface } from './interface';

export class Drawing implements DrawingInterface {
  private _ref: RefObject<HTMLCanvasElement | null>;
  private _operations = new Stack<CanvasOperation>();

  constructor(ref: RefObject<HTMLCanvasElement | null>) {
    this._ref = ref;
  }

  // PUBLIC METHODS
  loadOperations: DrawingInterface['loadOperations'] = async (
    canvasOperations,
    renderInFrames = true,
    asNewOperation = true
  ) => {
    const opsQueue = [...canvasOperations];
    const executeOperation = async () => {
      const operation = opsQueue.shift();
      if (!operation) return;
      if (asNewOperation) this._operations.push(operation);
      const { actionType, color, points, size } = operation;
      switch (actionType) {
        case CanvasAction.LINE:
          if (points?.length === 2 && color && size) {
            const [from, to] = points;
            this._line(from, to, color, size);
          }
          break;
        case CanvasAction.ERASE:
          if (points?.length === 2 && size) {
            const [from, to] = points;
            this._erase(from, to, size);
          }
          break;
        case CanvasAction.FILL:
          if (points?.length === 1 && color) {
            const [point] = points;
            await this._fill(point, color);
          }
          break;
        case CanvasAction.CLEAR:
          this._clear();
          break;
        default:
          break;
      }
      if (renderInFrames) requestAnimationFrame(executeOperation);
      else executeOperation();
    };
    executeOperation();
  };

  reloadOperations = async () => {
    await this.loadOperations(this._operations.toArray(), false, false);
  };

  // PRIVATE METHODS
  private _line = (
    from: Coordinate,
    to: Coordinate,
    color: string,
    size: number
  ) => {
    const ctx = this._getContext();
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  private _erase = (from: Coordinate, to: Coordinate, size: number) => {
    this._line(from, to, DARK_BOARD_GREEN_HEX, size);
  };

  private _fill = async (point: Coordinate, color: string): Promise<void> => {
    const ctx = this._getContext(true);
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    if (window.Worker) {
      // Scaled point is only required when operating on image data
      const scaledPoint: Coordinate = {
        x: point.x * window.devicePixelRatio,
        y: point.y * window.devicePixelRatio,
      };
      const previousColor = getPixelHexCode(ctx, scaledPoint);
      const imageData = ctx.getImageData(0, 0, this._maxWidth, this._maxHeight);
      const newImageData = await this._asyncFillWorker(
        imageData,
        scaledPoint,
        previousColor,
        color,
        this._maxWidth,
        this._maxHeight
      );
      ctx.putImageData(newImageData, 0, 0);
    } else {
      // eslint-disable-next-line no-console
      console.error('Unsupported browser');
    }
  };

  private _clear = () => {
    const ctx = this._getContext();
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    ctx.clearRect(0, 0, this._maxWidth, this._maxHeight);
    ctx.fillStyle = DARK_BOARD_GREEN_HEX;
    ctx.fillRect(0, 0, this._maxWidth, this._maxHeight);
  };

  private _batchLine = (points: Coordinate[], color: string, size: number) => {
    const nPoints = points.length;
    const ctx = this._getContext();
    if (nPoints < 2 || !ctx) return;
    for (let i = 1; i < nPoints; i++) {
      const from = points[i - 1];
      const to = points[i];
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  };

  private _batchErase = (points: Coordinate[], size: number) => {
    this._batchLine(points, DARK_BOARD_GREEN_HEX, size);
  };

  private async _asyncFillWorker(
    imageData: ImageData,
    point: Coordinate,
    previousColor: string,
    newColor: string,
    maxWidth: number,
    maxHeight: number
  ): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const fillWorker = new Worker(
        new URL('../../../workers/canvas/fill.worker', import.meta.url)
      );
      fillWorker.postMessage({
        imageData,
        point,
        previousColor,
        newColor,
        maxWidth,
        maxHeight,
      });
      fillWorker.onmessage = (event: MessageEvent<ImageData>) => {
        const newImageData = event.data;
        if (newImageData) resolve(newImageData);
        else reject();
      };
    });
  }

  private _getContext(willReadFrequently = false) {
    const ctx = this._ref.current?.getContext('2d', { willReadFrequently });
    if (ctx) ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  private get _maxWidth() {
    if (!this._ref.current) return 0;
    return this._ref.current.width;
  }

  private get _maxHeight() {
    if (!this._ref.current) return 0;
    return this._ref.current.height;
  }
}
