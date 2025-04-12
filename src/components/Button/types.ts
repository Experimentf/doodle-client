import { ReactNode } from 'react';

import { ColorType, VariantType } from '@/types/styles';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  color?: ColorType;
  loading?: boolean;
}

export interface IconButtonProps extends Omit<ButtonProps, 'loading'> {
  icon: ReactNode;
  tooltip?: string;
  anchor?: 'front' | 'back';
}
