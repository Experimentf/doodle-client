import { Fragment, PropsWithChildren } from 'react';

import Tooltip from '@/components/Tooltip';
import { getVariantClass } from '@/utils/variants';

import { IconButtonProps } from '../types';
import { IconButtonClassSource } from './utils';

interface WrapperProps extends PropsWithChildren {
  label?: string;
}

const Wrapper = ({ label, ...rest }: WrapperProps) => {
  if (!label) return <Fragment {...rest} />;
  return <Tooltip label={label} {...rest} />;
};

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
  const label = tooltip && !props.disabled ? tooltip : undefined;

  return (
    <Wrapper label={label}>
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
