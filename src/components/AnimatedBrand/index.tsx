import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { ReactComponent as Brand } from '@/assets/brand.svg';

interface AnimatedBrandProps {
  className?: string;
  // Traveling wave while connecting; a calm idle wobble once connected.
  // Re-calling animate() on the same paths interrupts smoothly from
  // wherever they currently are - no CSS class-swap snap.
  loading?: boolean;
}

// brand.svg has 6 letters, each with a shadow twin 6 apart (12 paths total).
const LETTER_COUNT = 6;

const AnimatedBrand = ({ className, loading = false }: AnimatedBrandProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paths = wrapperRef.current?.querySelectorAll('path');
    if (!paths || paths.length === 0) return;

    const controls = animate(
      paths,
      loading
        ? {
            originX: 0.5,
            originY: 1,
            scale: [1, 0.92, 1],
            opacity: [1, 0.6, 1],
          }
        : { originX: 0.5, originY: 1, rotate: [0, -5, 3, -4, 4, 0] },
      {
        duration: loading ? 0.9 : 5,
        delay: (i) => (i % LETTER_COUNT) * (loading ? 0.1 : 0.08),
        repeat: Infinity,
        ease: 'easeInOut',
      }
    );

    return () => controls.stop();
  }, [loading]);

  return (
    <div ref={wrapperRef} className={className}>
      <Brand className="w-full h-full" style={{ overflow: 'visible' }} />
    </div>
  );
};

export default AnimatedBrand;
