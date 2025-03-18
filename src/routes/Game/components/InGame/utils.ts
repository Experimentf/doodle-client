import { ReactElement } from 'react';

import { CanvasAction } from '@/types/canvas';

export enum OptionKey {
  PENCIL = 'Pencil',
  ERASER = 'Eraser',
  FILL = 'Fill',
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

const optionToCanvasActionMap = {
  [OptionKey.PENCIL]: CanvasAction.LINE,
  [OptionKey.ERASER]: CanvasAction.ERASE,
  [OptionKey.FILL]: CanvasAction.FILL,
  [OptionKey.CLEAR]: CanvasAction.CLEAR,
  [OptionKey.UNDO]: CanvasAction.UNDO,
  [OptionKey.REDO]: CanvasAction.REDO,
};

export const convertOptionKeyToCanvasActionKey = (key?: OptionKey) => {
  if (!key) return undefined;
  return optionToCanvasActionMap[key];
};

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
    key: OptionKey.FILL,
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
