import React, { ReactElement, useState } from 'react';
import {
  FaEraser,
  FaFillDrip,
  FaPencilAlt,
  FaTrash,
  FaUndo,
} from 'react-icons/fa';

import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';

import Canvas from './Canvas';
import EditOption from './Option';
import { OptionKey, options } from './utils';

const icons: Record<OptionKey, ReactElement> = {
  [OptionKey.PENCIL]: <FaPencilAlt />,
  [OptionKey.ERASER]: <FaEraser />,
  [OptionKey.FILL]: <FaFillDrip />,
  [OptionKey.CLEAR]: <FaTrash />,
  [OptionKey.UNDO]: <FaUndo />,
};

const InGame = () => {
  const [selectedOption, setSelectedOption] = useState<OptionKey>();
  const {
    room: { drawerId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const {
    action: { clear, undo },
  } = useCanvas();
  const isDrawing = id === drawerId;

  const handlers: Record<OptionKey, () => void> = {
    [OptionKey.PENCIL]: () => {},
    [OptionKey.ERASER]: () => {},
    [OptionKey.FILL]: () => {},
    [OptionKey.CLEAR]: clear,
    [OptionKey.UNDO]: undo,
  };
  const editOptions = options.map((option) => ({
    ...option,
    icon: icons[option.key],
    handler: handlers[option.key],
  }));

  return (
    <div className="w-full relative">
      <Canvas />
      <div className="flex flex-auto justify-center mt-2 gap-2">
        {editOptions.map(({ isSelectable, handler, icon, key }) => (
          <EditOption
            key={key}
            isSelected={key === selectedOption}
            onClick={() => {
              if (isSelectable) setSelectedOption(key);
              handler?.();
            }}
            disabled={!isDrawing}
            label={key}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
};

export default InGame;
