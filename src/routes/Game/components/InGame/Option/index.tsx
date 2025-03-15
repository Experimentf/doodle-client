import { ReactElement } from 'react';

import IconButton from '@/components/Button/IconButton';

interface OptionProps {
  icon: ReactElement;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  disabled: boolean;
}

const Option = ({ icon, label, isSelected, ...rest }: OptionProps) => {
  return (
    <IconButton
      icon={icon}
      tooltip={label}
      className={`p-2 ${
        !rest.disabled ? 'text-dark-chalk-white' : 'text-chalk-white'
      } ${
        isSelected
          ? '!bg-chalk-yellow'
          : 'bg-white disabled:bg-dark-chalk-white'
      }`}
      {...rest}
    />
  );
};
export default Option;
