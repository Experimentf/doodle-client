import { Server } from "socket.io";
import { ErrorFromServer } from "../utils/error";

type CallbackFunction = (data: any, error?: ErrorFromServer) => void;

export interface Member {
    id: string;
    name: string;
    isOwner: boolean;
}

export interface RoomInfoType {
    type: "public" | "private";
    ownerId?: string;
    isWaiting?: boolean;
}

export type RoomInfoMapType = Map<string, RoomInfoType>;

export interface ServerToClientEvents {
    "new-user": (member: Member) => void;
    "user-leave": (member: Member) => void;
    // basicEmit: (a: number, b: string, c: Buffer) => void;
    // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    "get-username": (callback: CallbackFunction) => void;
    "set-username": (name: string) => void;
    "play-public-game": (callback: CallbackFunction) => void;
    "get-game-details": (roomId: string, callback: CallbackFunction) => void;
}

export interface InterServerEvents {}

export interface SocketData {
    name: string;
}

export type IoType = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;
