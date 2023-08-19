export type MemberType = {
    id: string;
    name: string;
    isOwner: boolean;
};

export type GameStatus = "game" | "lobby" | "end";

export type RoomType = "public" | "private";
