import { ColorClassSource, VariantColorClassSource } from '@/types/styles';

const PrimaryTextVariantClasses: ColorClassSource = {
  primary: 'text-chalk-white',
  secondary: 'text-chalk-blue',
  success: 'text-chalk-green',
  error: 'text-chalk-pink',
  warning: 'text-chalk-yellow',
};

const SecondaryTextVariantClasses: ColorClassSource = {
  primary: 'text-chalk-white',
  secondary: 'text-chalk-blue',
  success: 'text-chalk-green',
  error: 'text-chalk-pink',
  warning: 'text-chalk-yellow',
};

export const TextClassSource: VariantColorClassSource = {
  primary: PrimaryTextVariantClasses,
  secondary: SecondaryTextVariantClasses,
};
