import { ColorClassSource } from '@/types/styles';

export const PrimaryIconButtonVariantClasses: ColorClassSource = {
  primary: 'bg-transparent text-chalk-white hover:text-dark-chalk-white',
  secondary: 'bg-transparent text-chalk-blue hover:text-dark-chalk-blue',
  success: 'bg-transparent text-chalk-green hover:text-dark-chalk-green',
  error: 'bg-transparent text-chalk-pink hover:text-dark-chalk-pink',
  warning: 'bg-transparent text-chalk-yellow hover:text-dark-chalk-yellow',
};

export const SecondaryIconButtonVariantClasses: ColorClassSource = {
  primary:
    'border-2 p-1 bg-transparent border-chalk-white text-chalk-white hover:text-board-green focus:text-board-green hover:bg-chalk-white focus:bg-chalk-white',
  secondary:
    'border-2 p-1 bg-transparent border-chalk-blue text-chalk-blue hover:text-board-green focus:text-board-green hover:bg-chalk-blue focus:bg-chalk-blue',
  success:
    'border-2 p-1 bg-transparent border-chalk-green text-chalk-green hover:text-board-green focus:text-board-green hover:bg-chalk-green focus:bg-chalk-green',
  error:
    'border-2 p-1 bg-transparent border-chalk-pink text-chalk-pink hover:text-board-green focus:text-board-green hover:bg-chalk-pink focus:bg-chalk-pink',
  warning:
    'border-2 p-1 bg-transparent border-chalk-yellow text-chalk-yellow hover:text-board-green focus:text-board-green hover:bg-chalk-yellow focus:bg-chalk-yellow',
};
