import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { FaShapes } from 'react-icons/fa';
import {
  TbCircle,
  TbLine,
  TbOval,
  TbRectangle,
  TbSquare,
} from 'react-icons/tb';

import { ShapeKind } from '@/utils/shapes';

import EditOption from '../Option';

const shapeIcons: Record<ShapeKind, ReactElement> = {
  [ShapeKind.LINE]: <TbLine />,
  [ShapeKind.RECTANGLE]: <TbRectangle />,
  [ShapeKind.SQUARE]: <TbSquare />,
  [ShapeKind.ELLIPSE]: <TbOval />,
  [ShapeKind.CIRCLE]: <TbCircle />,
};

interface ShapePickerProps {
  // Only set while the shape tool is active; otherwise the button shows the generic icon.
  selectedShape?: ShapeKind;
  onSelect: (shape: ShapeKind) => void;
  disabled?: boolean;
}

const ShapePicker = ({
  selectedShape,
  onSelect,
  disabled = false,
}: ShapePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (ev: PointerEvent) => {
      if (!containerRef.current?.contains(ev.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div ref={containerRef} className="relative">
      <EditOption
        icon={selectedShape ? shapeIcons[selectedShape] : <FaShapes />}
        label={selectedShape ?? 'Shape'}
        isSelected={!!selectedShape}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Centering via motion's x - it owns `transform`, so a Tailwind translate class would be overwritten.
            initial={{ opacity: 0, x: '-50%', y: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 bottom-full mb-3 left-1/2 w-max origin-bottom"
          >
            <div className="flex gap-3 p-3 rounded-xl bg-card-surface-2 shadow-lg">
              {Object.values(ShapeKind).map((shape) => (
                <EditOption
                  key={shape}
                  icon={shapeIcons[shape]}
                  label={shape}
                  isSelected={shape === selectedShape}
                  onClick={() => {
                    onSelect(shape);
                    setIsOpen(false);
                  }}
                  disabled={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapePicker;
