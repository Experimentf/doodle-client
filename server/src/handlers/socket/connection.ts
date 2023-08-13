import { Socket } from "socket.io";
import { IoType } from "../../types/socket";

export const onSocketConnectHandler = (io: IoType, socket: Socket) => {
    console.log("User connected :", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected :", socket.id);
    });
};

export const onSocketDisconnectHandler = (io: IoType, socket: Socket) => {};
