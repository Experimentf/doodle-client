// import { useState } from 'react';

import { Coordinate } from '@/types/common';

// enum CanvasOperationType {
//   STROKE,
//   FILL,
//   ERASE,
//   CLEAR,
//   UNKNOWN,
// }

// interface CanvasOperation {
//   type: CanvasOperationType;
// }

const useCanvasActions = (ctx?: CanvasRenderingContext2D | null) => {
  // const [operations, setOperations] = useState<Array<CanvasOperation>>([]);

  const line = (from: Coordinate, to: Coordinate) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const fill = () => {};

  const erase = () => {};

  const clear = () => {};

  const undo = () => {};

  const redo = () => {};

  return { line, fill, erase, clear, undo, redo };
};

export default useCanvasActions;
