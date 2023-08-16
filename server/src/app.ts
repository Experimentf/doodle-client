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

const getRoomDetails = (roomId: string) => {
    if (publicRoomsInfoMap.has(roomId)) return publicRoomsInfoMap.get(roomId);
    if (privateRoomsInfoMap.has(roomId)) return privateRoomsInfoMap.get(roomId);
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
            const roomId = onPlayPublicGameHandler(
                io,
                socket,
                publicRoomsInfoMap
            );

            // Join the new room
            socket.join(roomId);

            // Let other users in the room know
            socket.to(roomId).emit("new-user", {
                id: socket.id,
                name: socket.data.name,
                isOwner: false,
            });

            callback(roomId);
        } catch (e) {
            callback(null, e as ErrorFromServer);
        }
    });

    // Get the details of the game
    socket.on("get-game-details", async (roomId, callback) => {
        try {
            const roomDetails = getRoomDetails(roomId);
            const { isWaiting, type, ownerId } = roomDetails as RoomInfoType;
            const memberSockets = await io.in(roomId).fetchSockets();

            const members = memberSockets.map((memberSocket) => ({
                id: memberSocket.id,
                name: memberSocket.data.name,
                isOwner: ownerId === memberSocket.id,
            }));

            callback({ isWaiting: isWaiting ?? false, members, type });
        } catch (e) {
            callback(null, e as ErrorFromServer);
        }
    });

    // Before disconnecting
    socket.on("disconnecting", () => {
        socket.rooms.forEach((roomId) => {
            socket.to(roomId).emit("user-leave", {
                id: socket.id,
                name: socket.data.name,
                isOwner: false,
            });
        });
    });

    // User leaves
    socket.on("disconnect", () => {
        console.log("User disconnected :", socket.id);
        onSocketDisconnectHandler(
            io,
            socket,
            publicRoomsInfoMap,
            privateRoomsInfoMap
        );
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
