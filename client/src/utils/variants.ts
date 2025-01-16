import {
  VariantColorClassSource,
  ColorType,
  VariantType,
} from '../types/styles';

export const getVariantClass = (
  variant: VariantType,
  color: ColorType,
  source: VariantColorClassSource
) => {
  return source[variant][color];
};
