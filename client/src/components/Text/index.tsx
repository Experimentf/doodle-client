import { ElementType } from 'react';
import { ColorType } from '../../types/styles';
import { getVariantClass } from '../../utils/variants';
import {
  PrimaryTextVariantClasses,
  SecondaryTextVariantClasses,
} from './utils';

interface TextProps extends HTMLElement {
  component: ElementType;
  color: ColorType;
}

const Text = ({ children, ...props }: TextProps) => {
  const {
    component: Component = 'p',
    color = 'primary',
    className,
    ...rest
  } = props;

  const variantClass = getVariantClass('primary', color, {
    primary: PrimaryTextVariantClasses,
    secondary: SecondaryTextVariantClasses,
  });

  return (
    <Component className={`${variantClass} ${className}`} {...rest}>
      {children}
    </Component>
  );
};

export default Text;
