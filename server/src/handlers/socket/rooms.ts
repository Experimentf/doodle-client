import { Socket } from "socket.io";
import { IoType, RoomInfoMapType, RoomInfoType } from "../../types/socket";
import { generateId } from "../../utils/unique";
import { ErrorFromServer } from "../../utils/error";
import { MAX_PUBLIC_ROOM_CAPACITY } from "../../constants/room";

const getRandomRoom = (
    io: IoType,
    socket: Socket,
    roomsInfoMap: RoomInfoMapType
) => {
    const nRooms = roomsInfoMap.size;
    const roomIdsArray = [];
    for (const [roomId, roomInfo] of roomsInfoMap.entries()) {
        roomIdsArray.push(roomId);
    }
    const randomRoomIndex = Math.round(Math.random() * (nRooms - 1));
    return roomIdsArray[randomRoomIndex];
};

export const onPlayPublicGameHandler = (
    io: IoType,
    socket: Socket,
    publicRoomsInfoMap: RoomInfoMapType
) => {
    // Store public rooms that have capacity
    const validRooms = new Map<string, RoomInfoType>();

    // Find public rooms that have capacity
    for (const [roomId, roomInfo] of publicRoomsInfoMap.entries()) {
        if (io.sockets.adapter.rooms.has(roomId)) {
            const membersSet = io.sockets.adapter.rooms.get(roomId);
            if (membersSet && membersSet.size < MAX_PUBLIC_ROOM_CAPACITY)
                validRooms.set(roomId, roomInfo);
        }
    }

    // Room to be joined
    let room = null;

    // If there are rooms with capacity, return one of them
    if (validRooms.size > 0) {
        room = getRandomRoom(io, socket, validRooms);
    } else {
        // Otherwise, create a new public room
        room = generateId();
        publicRoomsInfoMap.set(room, { type: "public" });
    }

    // Return the room id
    return room;
};
