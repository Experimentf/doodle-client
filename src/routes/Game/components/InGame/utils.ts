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
  isSelectable?: boolean;
  handler: () => void;
  disabled: boolean;
}

export const options: Array<Omit<Option, 'icon' | 'handler'>> = [
  {
    key: OptionKey.PENCIL,
    isSelectable: true,
    disabled: false,
  },
  {
    key: OptionKey.ERASER,
    isSelectable: true,
    disabled: false,
  },
  {
    key: OptionKey.CLEAR,
    isSelectable: false,
    disabled: false,
  },
];

export const historyOptions: Array<Omit<Option, 'icon' | 'handler'>> = [
  {
    key: OptionKey.UNDO,
    disabled: false,
  },
  {
    key: OptionKey.REDO,
    disabled: false,
  },
];
