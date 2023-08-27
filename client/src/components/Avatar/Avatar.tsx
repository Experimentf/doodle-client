import React from "react";
import { BigHead, AvatarProps } from "@bigheads/core";

interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    avatarProps: AvatarProps;
}

const Avatar = ({ avatarProps, ...props }: CustomAvatarProps) => {
    return (
        <div {...props}>
            <BigHead {...avatarProps} />
        </div>
    );
};

export default Avatar;
