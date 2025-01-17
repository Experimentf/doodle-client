import { ColorType } from '@/types/styles';

import { HunchInterface } from './types';

export const getColorFromHunchStatus = (
  status: HunchInterface['status']
): ColorType => {
  switch (status) {
    case '0':
      return 'error';
    case '1':
      return 'warning';
    case '2':
      return 'success';
    default:
      return 'primary';
  }
};
