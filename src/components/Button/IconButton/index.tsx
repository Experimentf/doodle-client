import { Fragment } from 'react';

import Tooltip from '@/components/Tooltip';
import { getVariantClass } from '@/utils/variants';

import { IconButtonProps } from '../types';
import { IconButtonClassSource } from './utils';

const IconButton = ({
  variant = 'primary',
  color = 'primary',
  anchor = 'front',
  className,
  children,
  tooltip,
  icon,
  ...props
}: IconButtonProps) => {
  const variantClass = getVariantClass(variant, color, IconButtonClassSource);

  const Wrapper = tooltip && !props.disabled ? Tooltip : Fragment;

  return (
    <Wrapper label={tooltip ?? ''}>
      <button
        className={`rounded-full transition-all hover:scale-125 disabled:hover:scale-100 ${variantClass} ${className}`}
        {...props}
      >
        <>
          {anchor === 'front' && icon}
          {children}
          {anchor === 'back' && icon}
        </>
      </button>
    </Wrapper>
  );
};

export default IconButton;
