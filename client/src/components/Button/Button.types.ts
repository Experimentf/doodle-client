import { ColorType } from '../../types/color';

export type VariantType = 'primary' | 'secondary';

export interface ButtonType
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  color?: ColorType;
}
