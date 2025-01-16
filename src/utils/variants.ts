import {
  ColorType,
  VariantColorClassSource,
  VariantType,
} from '@/types/styles';

export const getVariantClass = (
  variant: VariantType,
  color: ColorType,
  source: VariantColorClassSource
) => {
  return source[variant][color];
};
