import React, {
  ChangeEvent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FaEraser, FaFillDrip, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';

import Tooltip from '@/components/Tooltip';
import { GameEvents } from '@/constants/Events';
import { useCanvas } from '@/contexts/canvas';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { CanvasAction } from '@/types/canvas';
import { GameStatus } from '@/types/models/game';
import { ServerToClientEvents } from '@/types/socket';

import Canvas from '../components/Canvas';
import { OptionConfig } from '../components/Canvas/useCanvasActions';
import EditOption from '../components/Option';
import { OptionKey, options } from '../components/Option/utils';

const icons: Record<OptionKey, ReactElement> = {
  [OptionKey.PENCIL]: <FaPencilAlt />,
  [OptionKey.ERASER]: <FaEraser />,
  [OptionKey.FILL]: <FaFillDrip />,
  [OptionKey.CLEAR]: <FaTrash />,
};

interface MainProps extends HTMLAttributes<HTMLDivElement> {
  component: ReactNode;
}

const Main = ({ component, ...props }: MainProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [optionConfig, setOptionConfig] = useState<OptionConfig>({
    color: '#ffffff',
    type: undefined,
    brushSize: 5,
  });

  const { registerEvent, unregisterEvent, asyncEmitEvent } = useSocket();
  const {
    room: { drawerId, id: roomId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const { game } = useGame();
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
      setOptionConfig((prev) => ({ ...prev, type: undefined }));
    } else {
      setOptionConfig((prev) => ({ ...prev, type: OptionKey.PENCIL }));
    }
    return () => {
      unregisterEvent(
        GameEvents.ON_GAME_CANVAS_OPERATION,
        handleOnGameCanvasOperation
      );
    };
  }, [isDrawing]);

  useEffect(() => {
    if (
      game.status === GameStatus.CHOOSE_WORD ||
      game.status === GameStatus.TURN_END
    )
      drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }]);
  }, [game.status]);

  const handleClear = async () => {
    drawing?.loadOperations([{ actionType: CanvasAction.CLEAR }]);
    await asyncEmitEvent(GameEvents.EMIT_GAME_CANVAS_OPERATION, {
      canvasOperation: { actionType: CanvasAction.CLEAR },
      roomId,
    });
  };

  const handleOptionConfigChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setOptionConfig((prev) => ({
      ...prev,
      [name]:
        typeof optionConfig[name as keyof OptionConfig] === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handlers: Record<OptionKey, () => void> = {
    [OptionKey.PENCIL]: () => {},
    [OptionKey.ERASER]: () => {},
    [OptionKey.FILL]: () => {},
    [OptionKey.CLEAR]: handleClear,
  };

  const editOptions = options.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
    disabled: !isDrawing,
  }));

  return (
    <div {...props}>
      <div className="relative">
        <Canvas optionConfig={optionConfig} />
        {component && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-scroll">
            {component}
          </div>
        )}
      </div>
      <div className="flex flex-auto justify-between items-center mt-4 mx-4 gap-6">
        <div className="flex flex-auto flex-grow-0 justify-center items-center gap-2">
          {editOptions.map(({ isSelectable, handler, icon, key, disabled }) => (
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
          ))}
          <Tooltip label="Color">
            <button
              onClick={() => colorInputRef.current?.click()}
              className="relative p-2 border-none rounded-full overflow-clip hover:scale-125 transition-all"
              style={{ backgroundColor: optionConfig.color }}
            >
              <IoMdColorPalette className="text-lg mix-blend-difference" />
              <input
                ref={colorInputRef}
                type="color"
                name="color"
                className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                value={optionConfig.color}
                onChange={handleOptionConfigChange}
              />
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white`}
              style={{
                width: `${optionConfig.brushSize}px`,
                height: `${optionConfig.brushSize}px`,
              }}
            ></div>
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-4 top-0 bg-dark-chalk-white" />
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-4 top-1/2 bg-dark-chalk-white" />
            <div className="absolute left-0 -translate-y-1/2 w-4 h-[2px] top-1/2 bg-dark-chalk-white" />
            <div className="absolute left-1/2 -translate-y-1/2 w-4 h-[2px] top-1/2 bg-dark-chalk-white" />
          </div>
          <input
            type="range"
            min={5}
            max={31}
            step={2}
            name="brushSize"
            value={optionConfig.brushSize}
            onChange={handleOptionConfigChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
