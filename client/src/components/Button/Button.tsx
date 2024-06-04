import { ButtonType } from './Button.types';
import { getVariantClass } from './Button.utils';

const Button = ({
  variant = 'primary',
  color = 'primary',
  className,
  children,
  ...props
}: ButtonType) => {
  const variantClass = getVariantClass(variant, color);

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
