import { HTMLAttributes, useLayoutEffect, useRef, useState } from 'react';

const VIEWPORT_MARGIN = 8;

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

const Tooltip = ({ label, children, ...rest }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shift, setShift] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Nudge back inside the viewport before paint - buttons near an edge would otherwise push it off-screen.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!isVisible || !tooltip) {
      setShift(0);
      return;
    }
    const { left, right } = tooltip.getBoundingClientRect();
    const maxRight = document.documentElement.clientWidth - VIEWPORT_MARGIN;
    if (right > maxRight) setShift(maxRight - right);
    else if (left < VIEWPORT_MARGIN) setShift(VIEWPORT_MARGIN - left);
  }, [isVisible]);

  return (
    <div className="relative" {...rest}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="hidden min-[701px]:block absolute top-full mt-2 -translate-x-1/3 text-xs whitespace-nowrap bg-chalk-white rounded-md p-2 pointer-events-none"
          style={{ marginLeft: shift }}
        >
          <p className="text-dark-board-green">{label}</p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
