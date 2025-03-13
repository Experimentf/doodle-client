import { useEffect, useState } from 'react';
import { FaEraser, FaPencilAlt, FaTrash, FaUndo } from 'react-icons/fa';
import {} from 'react-icons/fa6';

import { useCanvas } from '@/contexts/canvas';
import { useRoom } from '@/contexts/room';
import { useUser } from '@/contexts/user';

import EditOption from './EditOption';

const EditOptions = () => {
  const {
    room: { drawerId },
  } = useRoom();
  const {
    user: { id },
  } = useUser();
  const { setCursorVisibility } = useCanvas();
  const isDrawing = id === drawerId;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handlePencil = () => {};
  const handleEraser = () => {};
  const handleClear = () => {};
  const handleUndo = () => {};

  const editOptions = [
    {
      icon: <FaPencilAlt />,
      label: 'Pencil',
      isSelectable: true,
      handler: handlePencil,
    },
    {
      icon: <FaEraser />,
      label: 'Eraser',
      isSelectable: true,
      handler: handleEraser,
    },
    {
      icon: <FaTrash />,
      label: 'Clear',
      isSelectable: false,
      handler: handleClear,
    },
    {
      icon: <FaUndo />,
      label: 'Undo',
      isSelectable: false,
      handler: handleUndo,
    },
  ];

  useEffect(() => {
    setCursorVisibility(!isDrawing);
  }, [isDrawing]);

  return (
    <div className="flex flex-auto justify-center mt-2 gap-2">
      {editOptions.map(({ isSelectable, handler, ...props }, index) => (
        <EditOption
          key={index}
          isSelected={index === selectedOption}
          onClick={() => {
            if (isSelectable) setSelectedOption(index);
            handler();
          }}
          disabled={!isDrawing}
          {...props}
        />
      ))}
    </div>
  );
};
export default EditOptions;
