// Cap backing-store resolution at 2x - 3x (common on phones) costs fill
// performance for barely-visible sharpness gains.
export const getCanvasPixelRatio = () =>
  Math.min(window.devicePixelRatio || 1, 2);
