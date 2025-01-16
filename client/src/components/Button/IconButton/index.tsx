import { getVariantClass } from '../../../utils/variants';
import { ButtonType } from '../types';
import {
  PrimaryIconButtonVariantClasses,
  SecondaryIconButtonVariantClasses,
} from './utils';

const IconButton = ({
  variant = 'primary',
  color = 'primary',
  className,
  children,
  ...props
}: ButtonType) => {
  const variantClass = getVariantClass(variant, color, {
    primary: PrimaryIconButtonVariantClasses,
    secondary: SecondaryIconButtonVariantClasses,
  });

  return (
    <button
      className={`${className} rounded-full transition-all ${variantClass}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
