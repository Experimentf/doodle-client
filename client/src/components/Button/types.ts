import { ColorType, VariantType } from '../../types/styles';

export interface ButtonType
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  color?: ColorType;
}
