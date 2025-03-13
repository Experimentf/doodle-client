import { ReactElement } from 'react';

import IconButton from '@/components/Button/IconButton';

interface EditOptionProps {
  icon: ReactElement;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  disabled: boolean;
}

const EditOption = ({ icon, label, isSelected, ...rest }: EditOptionProps) => {
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
export default EditOption;
