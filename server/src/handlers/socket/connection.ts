import { Socket } from "socket.io";
import { IoType, RoomInfoMapType } from "../../types/socket";

export const onSocketConnectHandler = (io: IoType, socket: Socket) => {
    console.log("User connected :", socket.id);
};

export const onSocketDisconnectHandler = (
    io: IoType,
    socket: Socket,
    publicRoomsInfoMap: RoomInfoMapType,
    privateRoomsInfoMap: RoomInfoMapType
) => {
    const newExistingRoomIdsMap = io.sockets.adapter.rooms;

    // Delete non-required ids from public
    const removableIdsFromPublic = [];
    for (const [publicRoomId, publicRoomInfo] of publicRoomsInfoMap.entries()) {
        if (!newExistingRoomIdsMap.has(publicRoomId))
            removableIdsFromPublic.push(publicRoomId);
    }
    for (const id of removableIdsFromPublic) {
        publicRoomsInfoMap.delete(id);
    }

    // Delete non-required ids from private
    const removableIdsFromPrivate = [];
    for (const [
        privateRoomId,
        privateRoomInfo,
    ] of privateRoomsInfoMap.entries()) {
        if (!newExistingRoomIdsMap.has(privateRoomId))
            removableIdsFromPrivate.push(privateRoomId);
    }
    for (const id of removableIdsFromPrivate) {
        privateRoomsInfoMap.delete(id);
    }
};
