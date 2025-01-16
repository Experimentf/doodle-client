import { getVariantClass } from '../../utils/variants';
import { ButtonType } from './types';
import {
  PrimaryButtonVariantClasses,
  SecondaryButtonVariantClasses,
} from './utils';

const Button = ({
  variant = 'primary',
  color = 'primary',
  className,
  children,
  ...props
}: ButtonType) => {
  const variantClass = getVariantClass(variant, color, {
    primary: PrimaryButtonVariantClasses,
    secondary: SecondaryButtonVariantClasses,
  });

  return (
    <button
      className={`${className} py-3 px-8 rounded-lg transition-all ${variantClass}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
