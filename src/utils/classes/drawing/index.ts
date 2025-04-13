import { RefObject } from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { getPixelHexCode } from '@/utils/colors';
import { floorCoordinate } from '@/utils/coordinate';

import { DrawingInterface } from './interface';

export class Drawing implements DrawingInterface {
  private _ref: RefObject<HTMLCanvasElement | null>;
  private _operations = new Array<CanvasOperation>();

  constructor(ref: RefObject<HTMLCanvasElement | null>) {
    this._ref = ref;
  }

  // PUBLIC METHODS
  public loadOperations: DrawingInterface['loadOperations'] = async (
    canvasOperations,
    renderInFrames = true,
    asNewOperation = true
  ) => {
    const opsQueue = [...canvasOperations];
    const executeOperation = async () => {
      const operation = opsQueue.shift();
      if (!operation) return;
      if (asNewOperation) this._operations.push(operation);
      const { actionType, color, points: normalizedPoints, size } = operation;
      const points = normalizedPoints?.map((point) =>
        floorCoordinate(this.denormalizeCoordinate(point))
      );

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

  public reloadOperations: DrawingInterface['reloadOperations'] = async () => {
    await this.loadOperations(this._operations, false, false);
  };

  public reset: DrawingInterface['reset'] = () => {
    this.loadOperations([{ actionType: CanvasAction.CLEAR }], false, false);
    this._operations = [];
  };

  public normalizeCoordinate: DrawingInterface['normalizeCoordinate'] = (
    coord: Coordinate
  ) => ({
    x: coord.x / this._maxWidth,
    y: coord.y / this._maxHeight,
  });

  public denormalizeCoordinate: DrawingInterface['denormalizeCoordinate'] = (
    coord: Coordinate
  ) => ({
    x: coord.x * this._maxWidth,
    y: coord.y * this._maxHeight,
  });

  // PRIVATE METHODS
  private _line = (
    from: Coordinate,
    to: Coordinate,
    color: string,
    size: number
  ) => {
    const ctx = this._getContext();
    if (!ctx) return;
    let { x: x1, y: y1 } = from;
    let { x: x2, y: y2 } = to;
    const radius = Math.floor(size / 2);
    x1 -= radius;
    y1 -= radius;
    x2 -= radius;
    y2 -= radius;
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (x1 != x2 || y1 != y2) {
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1, size, size);
      const err2 = err * 2;
      if (err2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (err2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  };

  private _erase = (from: Coordinate, to: Coordinate, size: number) => {
    this._line(from, to, DARK_BOARD_GREEN_HEX, size);
  };

  private _fill = async (point: Coordinate, color: string): Promise<void> => {
    const ctx = this._getContext(true);
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    if (window.Worker) {
      const previousColor = getPixelHexCode(ctx, point);
      const imageData = ctx.getImageData(0, 0, this._maxWidth, this._maxHeight);
      const newImageData = await this._asyncFillWorker(
        imageData,
        point,
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
    const ctx = this._ref.current?.getContext('2d', {
      willReadFrequently,
      alpha: false,
    });
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
