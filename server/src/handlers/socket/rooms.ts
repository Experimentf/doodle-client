import { Socket } from "socket.io";
import { IoType } from "../../types/socket";
import { generateId } from "../../utils/unique";

export const onCreatePrivateRoomHandler = (io: IoType, socket: Socket) => {
    const roomId = generateId();
    const ownerId = socket.id;
    return { roomId, ownerId };
};
