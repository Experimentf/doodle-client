import React, { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { FaEraser, FaPencilAlt, FaRedo, FaTrash, FaUndo } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';

import Tooltip from '@/components/Tooltip';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';
import { CanvasAction } from '@/types/canvas';

import Canvas from './Canvas';
import { OptionConfig } from './Canvas/useCanvasActions';
import EditOption from './Option';
import { historyOptions, OptionKey, options } from './utils';

const icons: Record<OptionKey, ReactElement> = {
  [OptionKey.PENCIL]: <FaPencilAlt />,
  [OptionKey.ERASER]: <FaEraser />,
  [OptionKey.CLEAR]: <FaTrash />,
  [OptionKey.UNDO]: <FaUndo />,
  [OptionKey.REDO]: <FaRedo />,
};

const InGame = () => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [optionConfig, setOptionConfig] = useState<OptionConfig>({
    color: '#ffffff',
    type: undefined,
    brushSize: 20,
  });
  const {
    room: { drawerId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const {
    action: { clear, undo, redo },
    isActionAllowed,
  } = useCanvas();
  const isDrawing = id === drawerId;

  const isDisabledOption: Record<OptionKey, boolean> = {
    [OptionKey.PENCIL]: !isDrawing,
    [OptionKey.ERASER]: !isDrawing,
    [OptionKey.CLEAR]: !isDrawing,
    [OptionKey.UNDO]: !isDrawing || !isActionAllowed[CanvasAction.UNDO],
    [OptionKey.REDO]: !isDrawing || !isActionAllowed[CanvasAction.REDO],
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
    [OptionKey.CLEAR]: clear,
    [OptionKey.UNDO]: undo,
    [OptionKey.REDO]: redo,
  };

  const editOptions = options.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
    disabled: isDisabledOption[option.key],
  }));

  const reversibleOptions = historyOptions.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
    disabled: isDisabledOption[option.key],
  }));

  return (
    <div className="w-full relative">
      <Canvas optionConfig={optionConfig} />
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
        <div className="flex gap-2">
          {reversibleOptions.map(({ key, handler, disabled, icon }) => (
            <EditOption
              key={key}
              isSelected={key === optionConfig.type}
              onClick={handler}
              disabled={disabled}
              label={key}
              icon={icon}
            />
          ))}
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
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-4 top-0 bg-white" />
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-4 top-1/2 bg-white" />
            <div className="absolute left-0 -translate-y-1/2 w-4 h-[2px] top-1/2 bg-white" />
            <div className="absolute left-1/2 -translate-y-1/2 w-4 h-[2px] top-1/2 bg-white" />
          </div>
          <input
            type="range"
            min={5}
            max={32}
            step={1}
            name="brushSize"
            value={optionConfig.brushSize}
            onChange={handleOptionConfigChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InGame;
