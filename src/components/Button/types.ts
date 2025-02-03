import { ReactNode } from 'react';

import { ColorType, VariantType } from '@/types/styles';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  color?: ColorType;
}

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  tooltip?: string;
  anchor?: 'front' | 'back';
}
