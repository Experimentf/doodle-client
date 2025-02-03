import { getVariantClass } from '@/utils/variants';

import { ButtonProps } from './types';
import { ButtonClassSource } from './utils';

const Button = ({
  variant = 'primary',
  color = 'primary',
  className,
  children,
  ...props
}: ButtonProps) => {
  const variantClass = getVariantClass(variant, color, ButtonClassSource);

  return (
    <button
      className={`${className} py-3 px-8 rounded-lg transition-all hover:scale-105 ${variantClass}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
