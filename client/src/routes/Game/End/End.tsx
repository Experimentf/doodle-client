import React, { PropsWithChildren } from "react";
import { MemberType } from "../../../types/game";

interface EndProps extends PropsWithChildren {
    members: MemberType[];
}

const End = ({ children }: EndProps) => {
    return <div>End</div>;
};

export default End;
