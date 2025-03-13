import { ColorClassSource, VariantColorClassSource } from '@/types/styles';

const PrimaryIconButtonVariantClasses: ColorClassSource = {
  primary:
    'bg-transparent text-chalk-white hover:text-dark-chalk-white disabled:hover:text-chalk-white disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-chalk-blue hover:text-dark-chalk-blue disabled:hover:text-chalk-blue disabled:cursor-not-allowed',
  success:
    'bg-transparent text-chalk-green hover:text-dark-chalk-green disabled:hover:text-chalk-green disabled:cursor-not-allowed',
  error:
    'bg-transparent text-chalk-pink hover:text-dark-chalk-pink disabled:hover:text-chalk-pink disabled:cursor-not-allowed',
  warning:
    'bg-transparent text-chalk-yellow hover:text-dark-chalk-yellow disabled:hover:text-chalk-yellow disabled:cursor-not-allowed',
};

const SecondaryIconButtonVariantClasses: ColorClassSource = {
  primary:
    'border-2 p-1 bg-transparent border-chalk-white text-chalk-white hover:text-board-green disabled:text-chalk-white focus:text-board-green hover:bg-chalk-white focus:bg-chalk-white disabled:cursor-not-allowed',
  secondary:
    'border-2 p-1 bg-transparent border-chalk-blue text-chalk-blue hover:text-board-green disabled:text-chalk-blue focus:text-board-green hover:bg-chalk-blue focus:bg-chalk-blue disabled:cursor-not-allowed',
  success:
    'border-2 p-1 bg-transparent border-chalk-green text-chalk-green hover:text-board-green disabled:text-chalk-green focus:text-board-green hover:bg-chalk-green focus:bg-chalk-green disabled:cursor-not-allowed',
  error:
    'border-2 p-1 bg-transparent border-chalk-pink text-chalk-pink hover:text-board-green disabled:text-chalk-pink focus:text-board-green hover:bg-chalk-pink focus:bg-chalk-pink disabled:cursor-not-allowed',
  warning:
    'border-2 p-1 bg-transparent border-chalk-yellow text-chalk-yellow hover:text-board-green disabled:text-chalk-yellow focus:text-board-green hover:bg-chalk-yellow focus:bg-chalk-yellow disabled:cursor-not-allowed',
};

export const IconButtonClassSource: VariantColorClassSource = {
  primary: PrimaryIconButtonVariantClasses,
  secondary: SecondaryIconButtonVariantClasses,
};
