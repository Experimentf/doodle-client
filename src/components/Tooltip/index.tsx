import { HTMLAttributes, useState } from 'react';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

const Tooltip = ({ label, children, ...rest }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative" {...rest}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute -bottom-full -translate-x-1/3 text-xs bg-chalk-white rounded-md p-2 pointer-events-none">
          <p className="text-dark-board-green">{label}</p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
