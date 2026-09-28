import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { IoMdColorPalette } from 'react-icons/io';

import Tooltip from '@/components/Tooltip';
import { mixHexColors } from '@/utils/colors';

interface PaletteColor {
  name: string;
  hex: string;
}

// Board eraser color (#031a14) is deliberately absent - drawing with it would be an invisible eraser.
const neutralColors: PaletteColor[] = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Light Grey', hex: '#c2c2c2' },
  { name: 'Dark Grey', hex: '#6b6b6b' },
  { name: 'Black', hex: '#000000' },
];

const hueColors: PaletteColor[] = [
  { name: 'Red', hex: '#e53935' },
  { name: 'Orange', hex: '#fb8c00' },
  { name: 'Yellow', hex: '#fdd835' },
  { name: 'Lime', hex: '#9ccc65' },
  { name: 'Green', hex: '#2e7d32' },
  { name: 'Teal', hex: '#00897b' },
  { name: 'Sky', hex: '#29b6f6' },
  { name: 'Blue', hex: '#1e56c8' },
  { name: 'Purple', hex: '#8e24aa' },
  { name: 'Pink', hex: '#ec407a' },
  { name: 'Brown', hex: '#8d5524' },
  { name: 'Skin', hex: '#e0ac69' },
];

// Negative tints toward white, positive shades toward black. Discrete so any color can be picked again exactly.
const shadeSteps = [
  { name: 'Lightest', amount: -0.6 },
  { name: 'Light', amount: -0.3 },
  { name: 'Normal', amount: 0 },
  { name: 'Dark', amount: 0.3 },
  { name: 'Darkest', amount: 0.55 },
];
const DEFAULT_SHADE = 2;

const getShade = (hex: string, shade: number) => {
  const { amount } = shadeSteps[shade];
  return amount < 0
    ? mixHexColors(hex, '#ffffff', -amount)
    : mixHexColors(hex, '#000000', amount);
};

const findHueShade = (color: string) => {
  const target = color.toLowerCase();
  for (let hue = 0; hue < hueColors.length; hue++) {
    for (let shade = 0; shade < shadeSteps.length; shade++) {
      if (getShade(hueColors[hue].hex, shade) === target) return { hue, shade };
    }
  }
  return undefined;
};

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker = ({ color, onChange, disabled }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shade, setShade] = useState(DEFAULT_SHADE);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedHue = findHueShade(color);

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

  // Losing the drawer turn mid-pick shouldn't leave a dead palette open.
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const handleToggle = () => {
    // Reopen on the current color's shade so its swatch is the one shown highlighted.
    if (!isOpen) setShade(selectedHue?.shade ?? DEFAULT_SHADE);
    setIsOpen((prev) => !prev);
  };

  const handleShadeChange = (nextShade: number) => {
    setShade(nextShade);
    // Live-adjust the current hue; neutrals have no shades to move through.
    if (selectedHue)
      onChange(getShade(hueColors[selectedHue.hue].hex, nextShade));
  };

  const trackBase = selectedHue ? hueColors[selectedHue.hue].hex : '#808080';
  const trackGradient = `linear-gradient(to right, ${shadeSteps
    .map((_, i) => getShade(trackBase, i))
    .join(', ')})`;

  const renderSwatch = ({ name, hex }: PaletteColor) => {
    const isSelected = hex === color.toLowerCase();
    return (
      <button
        key={name}
        onClick={() => {
          onChange(hex);
          setIsOpen(false);
        }}
        aria-label={name}
        title={name}
        className={`w-7 h-7 rounded-full border border-light-chalk-white transition-all hover:scale-125 active:scale-125 ${
          isSelected
            ? 'scale-125 ring-2 ring-chalk-yellow ring-offset-2 ring-offset-card-surface-2'
            : ''
        }`}
        style={{ backgroundColor: hex }}
      />
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <Tooltip label="Color">
        <button
          onClick={handleToggle}
          disabled={disabled}
          aria-label="Color"
          aria-expanded={isOpen}
          className="p-2 border-none rounded-full transition-all hover:scale-125 active:scale-125 disabled:hover:scale-100 disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: color }}
        >
          <IoMdColorPalette className="text-lg mix-blend-difference" />
        </button>
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Centering via motion's x - it owns `transform`, so a Tailwind translate class would be overwritten.
            initial={{ opacity: 0, x: '-50%', y: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            // w-max: the anchor wrapper is only button-wide, which would squeeze the grid columns.
            className="absolute z-30 bottom-full mb-3 left-1/2 w-max origin-bottom"
          >
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-card-surface-2 shadow-lg">
              <div className="grid grid-cols-4 gap-3">
                {neutralColors.map(renderSwatch)}
              </div>
              <div className="h-px bg-dark-chalk-white" />
              <div className="grid grid-cols-4 gap-3">
                {hueColors.map((hue) =>
                  renderSwatch({ ...hue, hex: getShade(hue.hex, shade) })
                )}
              </div>
              <input
                type="range"
                min={0}
                max={shadeSteps.length - 1}
                step={1}
                value={shade}
                onChange={(ev) => handleShadeChange(Number(ev.target.value))}
                aria-label="Shade"
                aria-valuetext={shadeSteps[shade].name}
                title={shadeSteps[shade].name}
                className="w-full h-3 mt-1 rounded-full appearance-none cursor-pointer border border-light-chalk-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-board-green [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-board-green"
                style={{ background: trackGradient }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
