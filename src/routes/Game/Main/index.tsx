import React, {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
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
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { CanvasAction } from '@/types/canvas';
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
  hunchInput?: ReactNode;
  players?: ReactNode;
}

// Minimum height of the players + hunches row below the canvas (and toolbar).
const BOTTOM_ROW_MIN = '7.5rem';
const GAP = '0.5rem';

const Main = ({
  component,
  compact = false,
  side = false,
  feed,
  hunchInput,
  players,
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
  const isDrawing = id === drawerId;

  // The toolbar wraps on narrow screens, so its height is measured to size the canvas above it.
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  useEffect(() => {
    const el = toolbarRef.current;
    if (!compact || !el) return;
    const resizeObserver = new ResizeObserver(() =>
      setToolbarHeight(el.offsetHeight)
    );
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [compact, side]);

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
    // Toolbar sits directly under the canvas so drawers keep the two visually connected.
    // Shown to everyone, like on desktop, so the canvas doesn't resize whenever the drawer changes.
    const toolbarReserve = ` - ${toolbarHeight}px - ${GAP}`;
    const canvasAndToolbar = (reserve: string) => (
      <>
        <div
          className="relative shrink-0 mx-auto aspect-video"
          style={{
            width: `min(100cqw, calc((100cqh${reserve}${toolbarReserve}) * 16 / 9))`,
          }}
        >
          {canvasContent}
        </div>
        <div ref={toolbarRef} className="shrink-0">
          {toolbar}
        </div>
      </>
    );
    const hunchColumn = (
      <>
        {feed}
        {hunchInput}
      </>
    );

    if (side) {
      return (
        <div {...props}>
          <div
            className="flex-1 min-w-0 min-h-0 flex flex-col gap-2"
            style={{ containerType: 'size' }}
          >
            {canvasAndToolbar('')}
          </div>
          <div className="w-[36%] max-w-sm min-h-0 flex flex-col gap-2">
            {players}
            {hunchColumn}
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
          {canvasAndToolbar(` - ${BOTTOM_ROW_MIN} - ${GAP}`)}
          <div
            className="flex-1 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2"
            style={{ minHeight: BOTTOM_ROW_MIN }}
          >
            {players}
            <div className="min-h-0 flex flex-col gap-2">{hunchColumn}</div>
          </div>
        </div>
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
