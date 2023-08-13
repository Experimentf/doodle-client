import { config } from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { onCreatePrivateRoomHandler } from "./handlers/socket/rooms";
import { onSocketConnectHandler } from "./handlers/socket/connection";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./types/socket";

config();

const app: Application = express();

const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, { cors: { origin: "*" } });

const roomToOwnerMap = new Map<string, string>();

// Socket
io.on("connection", (socket) => {
    onSocketConnectHandler(io, socket);

    socket.on("create-private-room", (callback) => {
        const room = onCreatePrivateRoomHandler(io, socket);
        socket.join(room.roomId);
        roomToOwnerMap.set(room.roomId, room.ownerId);
        callback(room);
    });

    socket.on("disconnect", () => {
        const joinedRooms = socket.rooms;
        for (const room in joinedRooms) {
            // If this socket is the owner of a room, delete that room
            if (roomToOwnerMap.get(room) === socket.id)
                roomToOwnerMap.delete(room);

            io.sockets.adapter.rooms.delete(room);
        }
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
