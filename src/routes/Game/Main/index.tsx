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
}

const Main = ({ component, ...props }: MainProps) => {
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

  return (
    <div {...props}>
      <div className="relative">
        <Canvas optionConfig={optionConfig} canDraw={isDrawing} />
        {component && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-scroll">
            {component}
          </div>
        )}
      </div>
      <div className="flex flex-auto justify-between items-center mt-2 lg:mt-4 mx-2 lg:mx-4 gap-6">
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
            onChange={(color) =>
              setOptionConfig((prev) => ({ ...prev, color }))
            }
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
    </div>
  );
};

export default Main;
