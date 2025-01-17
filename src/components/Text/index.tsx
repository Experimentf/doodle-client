import { ElementType, HTMLAttributes } from 'react';

import { ColorType } from '@/types/styles';
import { getVariantClass } from '@/utils/variants';

import { TextClassSource } from './utils';

interface TextProps extends HTMLAttributes<HTMLElement> {
  component?: ElementType;
  color?: ColorType;
  disabled?: boolean;
}

const Text = (props: TextProps) => {
  const {
    component: Component = 'p',
    color = 'primary',
    className,
    disabled,
    ...rest
  } = props;

  const variantClass = getVariantClass('primary', color, TextClassSource);

  return (
    <Component
      className={`${
        disabled ? 'text-light-chalk-white' : variantClass
      } ${className}`}
      {...rest}
    />
  );
};

export default Text;
