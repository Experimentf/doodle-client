import { config } from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { onSocketConnectHandler } from "./handlers/socket/connection";
import {
    ClientToServerEvents,
    InterServerEvents,
    RoomInfoMapType,
    RoomInfoType,
    ServerToClientEvents,
    SocketData,
} from "./types/socket";
import { ErrorFromServer } from "./utils/error";
import { onPlayPublicGameHandler } from "./handlers/socket/rooms";

config();

const app: Application = express();

const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, { cors: { origin: "*" } });

// Information regarding rooms
const publicRoomsInfoMap: RoomInfoMapType = new Map<string, RoomInfoType>();

const privateRoomsInfoMap: RoomInfoMapType = new Map<string, RoomInfoType>();

// Socket
io.on("connection", (socket) => {
    onSocketConnectHandler(io, socket);

    // Get username
    socket.on("get-username", (callback) => {
        const name = socket.data.name;
        if (!name) {
            const error = new ErrorFromServer("User does not exist");
            callback(null, error);
            return;
        }
        callback(name);
    });

    // Set username
    socket.on("set-username", (name) => (socket.data.name = name));

    // Play Public Game
    socket.on("play-public-game", (callback) => {
        try {
            const roomId = onPlayPublicGameHandler(
                io,
                socket,
                publicRoomsInfoMap
            );
            callback(roomId);
        } catch (e) {
            callback(null, e as ErrorFromServer);
        }
    });

    // User leaves
    socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
