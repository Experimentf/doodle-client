import { AvatarProps, BigHead } from '@bigheads/core';
import React from 'react';

interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  avatarProps?: AvatarProps;
}

const Avatar = ({ avatarProps, ...props }: CustomAvatarProps) => {
  return (
    <div {...props}>
      <BigHead {...avatarProps} />
    </div>
  );
};

export default Avatar;
