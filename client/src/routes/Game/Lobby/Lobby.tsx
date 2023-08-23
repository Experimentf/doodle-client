import React, { PropsWithChildren, ReactElement } from "react";
import { MemberType, RoomType } from "../../../types/game";

interface LobbyProps extends PropsWithChildren {
    members: MemberType[];
    roomType: RoomType;
}

const Lobby = ({ roomType, members, children }: LobbyProps) => {
    const lobbyDetails = {
        nPlayers: ["Number of players", members.length],
        lang: ["Language", "English"],
    };
    const captions: { [key in RoomType]: ReactElement<HTMLParagraphElement> } =
        {
            public: (
                <p className="text-chalk-green text-xs">
                    The game will start when there are more than{" "}
                    <span className="text-dark-chalk-pink">1</span> players
                </p>
            ),
            private: (
                <p className="text-chalk-green text-xs">
                    The game will start when the owner decides.
                </p>
            ),
        };

    return (
        <div className="flex gap-8">
            <div className="w-full p-4 rounded-lg flex flex-col items-center">
                <div className="py-8 px-12 inline-block bg-card-surface-1 rounded-xl -rotate-6">
                    <h1 className="text-xl">Lobby</h1>
                </div>
                <table className="mt-10">
                    {Object.keys(lobbyDetails).map((key, index) => {
                        const lobbyDetailKey = key as keyof typeof lobbyDetails;
                        return (
                            <tr key={index}>
                                <td className="text-light-chalk-white py-5">
                                    {lobbyDetails[lobbyDetailKey][0]}
                                </td>
                                <td className="px-10 py-5" />
                                <td className="text-chalk-white py-5">
                                    {lobbyDetails[lobbyDetailKey][1]}
                                </td>
                            </tr>
                        );
                    })}
                </table>
                <div className="mt-10"></div>
            </div>
            {children}
        </div>
    );
};

export default Lobby;
