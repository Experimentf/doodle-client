import { getVariantClass } from '@/utils/variants';

import Loading from '../Loading';
import { ButtonProps } from './types';
import { ButtonClassSource } from './utils';

const Button = ({
  variant = 'primary',
  color = 'primary',
  className,
  loading,
  children,
  ...props
}: ButtonProps) => {
  const variantClass = getVariantClass(variant, color, ButtonClassSource);

  return (
    <button
      className={`${className} py-3 px-8 rounded-lg transition-all hover:enabled:scale-105 ${variantClass}`}
      {...props}
      {...(loading && { disabled: true })}
    >
      {loading ? <Loading /> : children}
    </button>
  );
};

export default Button;
