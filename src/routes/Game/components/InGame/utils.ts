import { ReactElement } from 'react';

export enum OptionKey {
  PENCIL = 'Pencil',
  ERASER = 'Eraser',
  CLEAR = 'Clear',
  UNDO = 'Undo',
  REDO = 'Redo',
}

export interface Option {
  key: OptionKey;
  icon: ReactElement;
  isSelectable: boolean;
  handler: () => void;
}

export const options: Array<Omit<Option, 'icon' | 'handler'>> = [
  {
    key: OptionKey.PENCIL,
    isSelectable: true,
  },
  {
    key: OptionKey.ERASER,
    isSelectable: true,
  },
  {
    key: OptionKey.CLEAR,
    isSelectable: false,
  },
  {
    key: OptionKey.UNDO,
    isSelectable: false,
  },
  {
    key: OptionKey.REDO,
    isSelectable: false,
  },
];
