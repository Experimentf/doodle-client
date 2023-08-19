import { config } from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
    onSocketConnectHandler,
    onSocketDisconnectHandler,
} from "./handlers/socket/connection";
import {
    ClientToServerEvents,
    InterServerEvents,
    RoomInfoMapType,
    ServerToClientEvents,
    SocketData,
} from "./types/socket";
import { ErrorFromServer } from "./utils/error";
import { onPlayPublicGameHandler } from "./handlers/socket/rooms";
import { Member, Room } from "./Game/Room";

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
const rooms: RoomInfoMapType = new Map<string, Room>();

const getRoomDetails = (roomId: string) => {
    if (rooms.has(roomId)) return rooms.get(roomId);
    throw new ErrorFromServer("Room not found!");
};

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
            const roomId = onPlayPublicGameHandler(io, socket, rooms);
            callback(roomId);
        } catch (e) {
            callback(null, e as ErrorFromServer);
        }
    });

    // Get the game details
    socket.on("get-game-details", (roomId, callback) => {
        const room = rooms.get(roomId);
        if (room && room?.getNumberOfMembers() > 1) {
            room.start();
        }
        callback(room?.getJSON());
    });

    // Before disconnecting
    socket.on("disconnecting", () => {
        onSocketDisconnectHandler(io, socket, rooms);
    });

    // User leaves
    socket.on("disconnect", () => {
        console.log("User disconnected :", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
