import React, {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  FaEraser,
  FaFillDrip,
  FaPencilAlt,
  FaShapes,
  FaTrash,
} from 'react-icons/fa';

import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { CanvasAction } from '@/types/canvas';
import { GameStatus } from '@/types/models/game';
import { ServerToClientEvents } from '@/types/socket';
import { getCanvasPixelRatio } from '@/utils/canvas';

import Canvas from '../components/Canvas';
import { OptionConfig } from '../components/Canvas/useCanvasActions';
import ColorPicker from '../components/ColorPicker';
import EditOption from '../components/Option';
import { OptionKey, options } from '../components/Option/utils';
import ShapePicker from '../components/ShapePicker';

const icons: Record<OptionKey, ReactElement> = {
  [OptionKey.PENCIL]: <FaPencilAlt />,
  [OptionKey.ERASER]: <FaEraser />,
  [OptionKey.FILL]: <FaFillDrip />,
  [OptionKey.SHAPE]: <FaShapes />,
  [OptionKey.CLEAR]: <FaTrash />,
};

const brushSizes = [
  { label: 'Small', size: 5 },
  { label: 'Medium', size: 10 },
  { label: 'Large', size: 20 },
];

interface MainProps extends HTMLAttributes<HTMLDivElement> {
  component: ReactNode;
  // Small/rigid screens: canvas sized by width and height, feed below it, one role-based bottom row.
  compact?: boolean;
  // Short landscape screens: canvas on the left at full height, everything else in a side column.
  side?: boolean;
  feed?: ReactNode;
  guesserBar?: ReactNode;
  footer?: ReactNode;
}

// Room the canvas always leaves below itself for the feed (its min height + gap).
const FEED_RESERVE = '5.5rem';

const Main = ({
  component,
  compact = false,
  side = false,
  feed,
  guesserBar,
  footer,
  ...props
}: MainProps) => {
  const [optionConfig, setOptionConfig] = useState<OptionConfig>({
    color: '#ffffff',
    type: OptionKey.PENCIL,
    brushSize: 5,
  });

  const { registerEvent, unregisterEvent, asyncEmitEvent } = useSocket();
  const {
    room: { drawerId, id: roomId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const { drawing } = useCanvas();
  const { game } = useGame();
  const isDrawing = id === drawerId;

  const handleOnGameCanvasOperation: ServerToClientEvents[GameEvents.ON_GAME_CANVAS_OPERATION] =
    ({ canvasOperation }) => {
      drawing?.loadOperations([canvasOperation]);
    };

  // Receive operations when user is not a drawer
  useEffect(() => {
    if (!isDrawing) {
      registerEvent(
        GameEvents.ON_GAME_CANVAS_OPERATION,
        handleOnGameCanvasOperation
      );
    }
    return () => {
      unregisterEvent(
        GameEvents.ON_GAME_CANVAS_OPERATION,
        handleOnGameCanvasOperation
      );
    };
  }, [isDrawing]);

  const handleClear = async () => {
    if (!isDrawing) return;
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }]);
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation: { actionType: CanvasAction.CLEAR },
      roomId,
    });
  };

  const handlers: Record<OptionKey, () => void> = {
    [OptionKey.PENCIL]: () => {},
    [OptionKey.ERASER]: () => {},
    [OptionKey.FILL]: () => {},
    [OptionKey.SHAPE]: () => {},
    [OptionKey.CLEAR]: handleClear,
  };

  const editOptions = options.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
  }));

  const canvasContent = (
    <>
      <Canvas optionConfig={optionConfig} canDraw={isDrawing} />
      {component && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-scroll">
          {component}
        </div>
      )}
    </>
  );

  const toolbar = (
    <div
      className={`flex items-center ${
        compact
          ? 'flex-none flex-wrap justify-center gap-x-4 gap-y-2'
          : 'flex-auto justify-between mt-2 lg:mt-4 mx-2 lg:mx-4 gap-6'
      }`}
    >
      <div className="flex flex-auto flex-grow-0 justify-center items-center gap-2">
        {editOptions.map(({ isSelectable, handler, icon, key, disabled }) =>
          key === OptionKey.SHAPE ? (
            <ShapePicker
              key={key}
              selectedShape={
                optionConfig.type === OptionKey.SHAPE
                  ? optionConfig.shape
                  : undefined
              }
              onSelect={(shape) =>
                setOptionConfig((prev) => ({
                  ...prev,
                  type: OptionKey.SHAPE,
                  shape,
                }))
              }
              disabled={disabled}
            />
          ) : (
            <EditOption
              key={key}
              isSelected={key === optionConfig.type}
              onClick={() => {
                if (isSelectable)
                  setOptionConfig((prev) => ({ ...prev, type: key }));
                handler?.();
              }}
              disabled={disabled}
              label={key}
              icon={icon}
            />
          )
        )}
        <ColorPicker
          color={optionConfig.color}
          onChange={(color) => setOptionConfig((prev) => ({ ...prev, color }))}
        />
      </div>
      <div className="flex items-center gap-2">
        {brushSizes.map(({ label, size }) => (
          <EditOption
            key={size}
            isSelected={size === optionConfig.brushSize}
            onClick={() =>
              setOptionConfig((prev) => ({ ...prev, brushSize: size }))
            }
            disabled={false}
            label={label}
            icon={
              // Negative margin keeps the button the same size as the other tools while the dot overflows the 1em icon box.
              <span className="flex items-center justify-center w-5 h-5 -m-0.5">
                <span
                  className="rounded-full"
                  // Inline: the custom Tailwind palette has no `current`, so `bg-current` emits nothing.
                  style={{
                    backgroundColor: 'currentColor',
                    width: size / getCanvasPixelRatio(),
                    height: size / getCanvasPixelRatio(),
                  }}
                />
              </span>
            }
          />
        ))}
      </div>
    </div>
  );

  if (compact) {
    const showToolbar = isDrawing && game.status === GameStatus.GAME;
    const bottomRow = showToolbar ? toolbar : guesserBar;

    if (side) {
      return (
        <div {...props}>
          <div
            className="flex-1 min-w-0 min-h-0 flex items-start justify-center"
            style={{ containerType: 'size' }}
          >
            <div
              className="relative shrink-0 aspect-video"
              style={{ width: 'min(100cqw, calc(100cqh * 16 / 9))' }}
            >
              {canvasContent}
            </div>
          </div>
          <div className="w-[38%] max-w-sm flex flex-col gap-2 min-h-0">
            {feed}
            {bottomRow}
            {footer}
          </div>
        </div>
      );
    }

    return (
      <div {...props}>
        <div
          className="flex-1 min-h-0 flex flex-col gap-2"
          style={{ containerType: 'size' }}
        >
          {/* Largest 16:9 box that fits both the width and the height left above the feed. */}
          <div
            className="relative shrink-0 mx-auto aspect-video"
            style={{
              width: `min(100cqw, calc((100cqh - ${FEED_RESERVE}) * 16 / 9))`,
            }}
          >
            {canvasContent}
          </div>
          {feed}
        </div>
        {bottomRow}
        {footer}
      </div>
    );
  }

  return (
    <div {...props}>
      <div className="relative">{canvasContent}</div>
      {toolbar}
    </div>
  );
};

export default Main;
