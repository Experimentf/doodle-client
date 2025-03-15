import React, { ReactElement, useRef, useState } from 'react';
import { FaEraser, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';

import Tooltip from '@/components/Tooltip';
import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';

import Canvas from './Canvas';
import { OptionConfig } from './Canvas/useCanvasActions';
import EditOption from './Option';
import { OptionKey, options } from './utils';

const icons: Record<OptionKey, ReactElement> = {
  [OptionKey.PENCIL]: <FaPencilAlt />,
  [OptionKey.ERASER]: <FaEraser />,
  [OptionKey.CLEAR]: <FaTrash />,
};

const InGame = () => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [optionConfig, setOptionConfig] = useState<OptionConfig>({
    color: '#ffffff',
    type: undefined,
  });
  const {
    room: { drawerId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const {
    action: { clear },
  } = useCanvas();
  const isDrawing = id === drawerId;

  const handlers: Record<OptionKey, () => void> = {
    [OptionKey.PENCIL]: () => {},
    [OptionKey.ERASER]: () => {},
    [OptionKey.CLEAR]: clear,
  };
  const editOptions = options.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
  }));

  return (
    <div className="w-full relative">
      <Canvas optionConfig={optionConfig} />
      <div className="flex flex-auto justify-center items-center mt-2 gap-2">
        {editOptions.map(({ isSelectable, handler, icon, key }) => (
          <EditOption
            key={key}
            isSelected={key === optionConfig.type}
            onClick={() => {
              if (isSelectable)
                setOptionConfig((prev) => ({ ...prev, type: key }));
              handler?.();
            }}
            disabled={!isDrawing}
            label={key}
            icon={icon}
          />
        ))}
        <Tooltip label="Color">
          <button
            onClick={() => colorInputRef.current?.click()}
            className="relative p-2 border-none rounded-full overflow-clip"
            style={{ backgroundColor: optionConfig.color }}
          >
            <IoMdColorPalette className="text-lg mix-blend-difference" />
            <input
              ref={colorInputRef}
              type="color"
              className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
              value={optionConfig.color}
              onChange={(ev) =>
                setOptionConfig((prev) => ({ ...prev, color: ev.target.value }))
              }
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default InGame;
