import { VariantColorClassSource } from '@/types/styles';

const PrimarySnackbarVariantClasses = {
  primary: 'bg-chalk-white text-board-green',
  secondary: 'bg-chalk-blue text-board-green',
  success: 'bg-chalk-green text-board-green',
  error: 'bg-chalk-pink text-board-green',
  warning: 'bg-chalk-yellow text-board-green',
};

const SecondarySnackbarVariantClasses = {
  primary: 'bg-chalk-white text-board-green',
  secondary: 'bg-chalk-blue text-board-green',
  success: 'bg-chalk-green text-board-green',
  error: 'bg-chalk-pink text-board-green',
  warning: 'bg-chalk-yellow text-board-green',
};

export const SnackbarClassSource: VariantColorClassSource = {
  primary: PrimarySnackbarVariantClasses,
  secondary: SecondarySnackbarVariantClasses,
};
