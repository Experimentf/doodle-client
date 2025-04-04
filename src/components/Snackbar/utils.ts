import { VariantColorClassSource } from '@/types/styles';

const PrimarySnackbarVariantClasses = {
  primary:
    'bg-chalk-white text-board-green [&>.line-loader]:bg-light-chalk-white',
  secondary:
    'bg-chalk-blue text-board-green [&>.line-loader]:bg-light-chalk-blue',
  success:
    'bg-chalk-green text-board-green [&>.line-loader]:bg-light-chalk-green',
  error: 'bg-chalk-pink text-board-green [&>.line-loader]:bg-light-chalk-pink',
  warning:
    'bg-chalk-yellow text-board-green [&>.line-loader]:bg-light-chalk-yellow',
};

const SecondarySnackbarVariantClasses = {
  primary:
    'bg-chalk-white text-board-green [&>.line-loader]:bg-light-chalk-white',
  secondary:
    'bg-chalk-blue text-board-green [&>.line-loader]:bg-light-chalk-blue',
  success:
    'bg-chalk-green text-board-green [&>.line-loader]:bg-light-chalk-green',
  error: 'bg-chalk-pink text-board-green [&>.line-loader]:bg-light-chalk-pink',
  warning:
    'bg-chalk-yellow text-board-green [&>.line-loader]:bg-light-chalk-yellow',
};

export const SnackbarClassSource: VariantColorClassSource = {
  primary: PrimarySnackbarVariantClasses,
  secondary: SecondarySnackbarVariantClasses,
};
