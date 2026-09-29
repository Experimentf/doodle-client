import { RefObject } from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasAction, CanvasOperation } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { floorCoordinate } from '@/utils/coordinate';
import {
  FillWorkerRequest,
  FillWorkerResponse,
} from '@/workers/canvas/fill.worker';

import { DrawingInterface } from './interface';

interface PendingFillRequest {
  resolve: (response: FillWorkerResponse) => void;
  reject: (reason?: unknown) => void;
}

export class Drawing implements DrawingInterface {
  private _ref: RefObject<HTMLCanvasElement | null>;
  private _operations = new Array<CanvasOperation>();
  private _fillWorker?: Worker;
  private _fillRequestId = 0;
  private _pendingFillRequests = new Map<number, PendingFillRequest>();
  private _previewSnapshot?: ImageData;

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
      const {
        actionType,
        color,
        points: normalizedPoints,
        size: normalizedSize,
      } = operation;
      const points = normalizedPoints?.map((point) =>
        floorCoordinate(this.denormalizeCoordinate(point))
      );
      const size =
        normalizedSize !== undefined
          ? Math.max(1, Math.round(this.denormalizeSize(normalizedSize)))
          : undefined;

      switch (actionType) {
        case CanvasAction.LINE:
          if (points?.length && color && size)
            this._polyline(points, color, size);
          break;
        case CanvasAction.ERASE:
          if (points?.length && size)
            this._polyline(points, DARK_BOARD_GREEN_HEX, size);
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
    this._previewSnapshot = undefined;
  };

  // Preview = restore the pixels from before the preview, then draw the candidate on top without recording it.
  public beginPreview: DrawingInterface['beginPreview'] = () => {
    const ctx = this._getContext();
    if (!ctx) return;
    this._previewSnapshot = ctx.getImageData(
      0,
      0,
      this._maxWidth,
      this._maxHeight
    );
  };

  public preview: DrawingInterface['preview'] = (canvasOperation) => {
    this._restorePreviewSnapshot();
    this.loadOperations([canvasOperation], false, false);
  };

  public endPreview: DrawingInterface['endPreview'] = () => {
    this._restorePreviewSnapshot();
    this._previewSnapshot = undefined;
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

  public normalizeSize: DrawingInterface['normalizeSize'] = (size: number) =>
    size / this._maxWidth;

  public denormalizeSize: DrawingInterface['denormalizeSize'] = (
    size: number
  ) => size * this._maxWidth;

  // PRIVATE METHODS
  private _restorePreviewSnapshot = () => {
    const ctx = this._getContext();
    const snapshot = this._previewSnapshot;
    // A resize redraws from history; a stale-sized snapshot must not be painted back.
    if (
      !ctx ||
      !snapshot ||
      snapshot.width !== this._maxWidth ||
      snapshot.height !== this._maxHeight
    )
      return;
    ctx.putImageData(snapshot, 0, 0);
  };

  // One point draws a dot; more draw connected segments (batched strokes).
  private _polyline = (points: Coordinate[], color: string, size: number) => {
    if (points.length === 1) this._line(points[0], points[0], color, size);
    for (let i = 1; i < points.length; i++)
      this._line(points[i - 1], points[i], color, size);
  };

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
    ctx.fillStyle = color;
    // Includes the end pixel, so from === to still draws a dot
    for (;;) {
      ctx.fillRect(x1, y1, size, size);
      if (x1 === x2 && y1 === y2) break;
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

  private _fill = async (point: Coordinate, color: string): Promise<void> => {
    const ctx = this._getContext();
    const ref = this._ref;
    if (!ctx || !ref.current) return;
    if (window.Worker) {
      const width = this._maxWidth;
      const height = this._maxHeight;
      const imageData = ctx.getImageData(0, 0, width, height);
      const { buffer, bbox } = await this._asyncFillWorker(
        imageData,
        point,
        color,
        width,
        height
      );
      // A resize mid-fill means this buffer no longer matches the canvas -
      // drop it instead of constructing an ImageData with a mismatched size.
      if (width !== this._maxWidth || height !== this._maxHeight) return;
      const newImageData = new ImageData(
        new Uint8ClampedArray(buffer),
        width,
        height
      );
      // Only paint back the region that actually changed instead of the
      // whole canvas.
      ctx.putImageData(
        newImageData,
        0,
        0,
        bbox.minX,
        bbox.minY,
        bbox.maxX - bbox.minX + 1,
        bbox.maxY - bbox.minY + 1
      );
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

  private _getFillWorker(): Worker {
    if (!this._fillWorker) {
      const fillWorker = new Worker(
        new URL('../../../workers/canvas/fill.worker', import.meta.url)
      );
      fillWorker.onmessage = (event: MessageEvent<FillWorkerResponse>) => {
        const response = event.data;
        const pending = this._pendingFillRequests.get(response.id);
        if (!pending) return;
        this._pendingFillRequests.delete(response.id);
        pending.resolve(response);
      };
      fillWorker.onerror = (error) => {
        this._pendingFillRequests.forEach(({ reject }) => reject(error));
        this._pendingFillRequests.clear();
        // Drop the broken worker so the next fill spins up a fresh one instead of hanging forever.
        this._fillWorker = undefined;
      };
      this._fillWorker = fillWorker;
    }
    return this._fillWorker;
  }

  private async _asyncFillWorker(
    imageData: ImageData,
    point: Coordinate,
    newColor: string,
    maxWidth: number,
    maxHeight: number
  ): Promise<FillWorkerResponse> {
    const fillWorker = this._getFillWorker();
    const id = this._fillRequestId++;
    const buffer = imageData.data.buffer;
    const request: FillWorkerRequest = {
      id,
      buffer,
      width: maxWidth,
      height: maxHeight,
      point,
      newColor,
    };
    return new Promise((resolve, reject) => {
      this._pendingFillRequests.set(id, { resolve, reject });
      // Transfer instead of clone - avoids copying the whole canvas buffer.
      fillWorker.postMessage(request, [buffer]);
    });
  }

  private _getContext() {
    const ctx = this._ref.current?.getContext('2d', {
      // Must be true on every call - attributes only apply on the first
      // getContext(), and fill needs frequent readback.
      willReadFrequently: true,
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
