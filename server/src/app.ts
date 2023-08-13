import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {
    ClientToServerEvents,
    InterServerEvents,
    IoType,
    ServerToClientEvents,
    SocketData,
} from "./types/socket";
import { onCreatePrivateRoomHandler } from "./handlers/socket/rooms";
import { onSocketConnectHandler } from "./handlers/socket/connection";
import { ErrorFromServer } from "./utils/error";

config();

const app: Application = express();

const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    onSocketConnectHandler(io, socket);

    socket.on("create-private-room", (callback) => {
        const room = onCreatePrivateRoomHandler(io, socket);
        socket.join(room.roomId);
        callback(null, new ErrorFromServer("Something went wrong!"));
        // callback(room);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
