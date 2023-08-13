import { Server } from "socket.io";
import { ErrorFromServer } from "../utils/error";

type CallbackFunction = (data: any, error?: ErrorFromServer) => void;

export interface ServerToClientEvents {
    // basicEmit: (a: number, b: string, c: Buffer) => void;
    // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    "create-private-room": (callback: CallbackFunction) => void;
}

export interface InterServerEvents {}

export interface SocketData {
    name: string;
    age: number;
}

export type IoType = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;
