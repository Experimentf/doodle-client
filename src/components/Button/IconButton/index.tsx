import { getVariantClass } from '@/utils/variants';

import { IconButtonProps } from '../types';
import { IconButtonClassSource } from './utils';

const IconButton = ({
  variant = 'primary',
  color = 'primary',
  anchor = 'front',
  className,
  children,
  icon,
  ...props
}: IconButtonProps) => {
  const variantClass = getVariantClass(variant, color, IconButtonClassSource);

  return (
    <button
      className={`${className} rounded-full transition-all hover:scale-125 ${variantClass}`}
      {...props}
    >
      <>
        {anchor === 'front' && icon}
        {children}
        {anchor === 'back' && icon}
      </>
    </button>
  );
};

export default IconButton;
