import Avatar from "../Avatar/Avatar";
import { MemberType } from "../../types/game";

interface MembetListType {
    userId: string;
    members: MemberType[];
}

const MemberList = ({ userId, members }: MembetListType) => {
    return (
        <div className="w-80">
            <div className="p-4 bg-card-surface-2 rounded-lg shadowed w-full">
                <h1 className="text-xl">Players</h1>
                <div>
                    {members.map((member, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <Avatar
                                className="min-w-[80px] w-20"
                                avatarProps={member.avatar}
                            />
                            <p className="text-light-chalk-white overflow-hidden text-ellipsis">
                                {member.name}
                            </p>
                            {userId === member.id && (
                                <span className="text-light-chalk-blue">
                                    (You)
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemberList;
