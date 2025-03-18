import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { DARK_BOARD_GREEN_HEX } from '@/constants/common';
import { CanvasAction } from '@/types/canvas';
import { Coordinate } from '@/types/common';
import { getPixelHexCode } from '@/utils/canvas';

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
  action: {
    [CanvasAction.LINE]: (
      from: Coordinate,
      to: Coordinate,
      color: string,
      size: number
    ) => void;
    [CanvasAction.FILL]: (point: Coordinate, color: string) => void;
    [CanvasAction.ERASE]: (
      from: Coordinate,
      to: Coordinate,
      size: number
    ) => void;
    [CanvasAction.CLEAR]: () => void;
  };
  bulkLineAction: (points: Coordinate[], color: string, size: number) => void;
  bulkEraseAction: (points: Coordinate[], size: number) => void;
}

const CanvasContext = createContext<CanvasContextInterface>({
  ref: { current: null },
  action: {
    line: () => {},
    fill: () => {},
    erase: () => {},
    clear: () => {},
  },
  bulkLineAction: () => {},
  bulkEraseAction: () => {},
});

const CanvasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const animationFrameID = useRef<number>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withRequestAnimationFrame = <T extends (...args: any[]) => void>(
    fn: (...args: Parameters<T>) => void
  ) => {
    return (...args: Parameters<T>) => {
      animationFrameID.current = requestAnimationFrame(() => {
        fn(...args);
      });
    };
  };

  const line = withRequestAnimationFrame<
    CanvasContextInterface['action']['line']
  >((from, to, color, size) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  const fill = withRequestAnimationFrame<
    CanvasContextInterface['action']['fill']
  >((point, color) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx || !ref.current) return;

    const maxWidth = ref.current.width;
    const maxHeight = ref.current.height;
    const imageData = ctx.getImageData(0, 0, maxWidth, maxHeight);
    const previousColor = getPixelHexCode(ctx, point);

    const fillWorker = new Worker(
      new URL('../../workers/canvas/fill.worker', import.meta.url)
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
  });

  const erase = withRequestAnimationFrame<
    CanvasContextInterface['action']['erase']
  >((from, to, size) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = DARK_BOARD_GREEN_HEX;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  const clear = withRequestAnimationFrame<
    CanvasContextInterface['action']['clear']
  >(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ref.current || !ctx) return;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    ctx.fillStyle = DARK_BOARD_GREEN_HEX;
    ctx.fillRect(0, 0, ref.current.width, ref.current.height);
  });

  const bulkLineAction = withRequestAnimationFrame<
    CanvasContextInterface['bulkLineAction']
  >((points, color, size) => {
    const nPoints = points.length;
    const ctx = ref.current?.getContext('2d');
    if (nPoints === 0 || !ctx) return;

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
  });

  const bulkEraseAction: CanvasContextInterface['bulkEraseAction'] = (
    points,
    size
  ) => {
    const nPoints = points.length;
    if (nPoints === 0) return;
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = DARK_BOARD_GREEN_HEX;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < nPoints; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  return (
    <CanvasContext.Provider
      value={{
        ref,
        action: { line, fill, erase, clear },
        bulkLineAction,
        bulkEraseAction,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasProvider;
