export type ColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning';

export type VariantType = 'primary' | 'secondary';

export type ColorClassSource = Record<ColorType, HTMLElement['className']>;

export type VariantColorClassSource = Record<VariantType, ColorClassSource>;
