import { Server } from "socket.io";
import { ErrorFromServer } from "../utils/error";

type CallbackFunction = (data: any, error?: ErrorFromServer) => void;

export interface RoomInfoType {
    type: "public" | "private";
    ownerId?: string;
}

export type RoomInfoMapType = Map<string, RoomInfoType>;

export interface ServerToClientEvents {
    // basicEmit: (a: number, b: string, c: Buffer) => void;
    // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    "set-username": (name: string) => void;
    "play-public-game": (callback: CallbackFunction) => void;
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
