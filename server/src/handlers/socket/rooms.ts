import { Socket } from "socket.io";
import { IoType, RoomInfoMapType } from "../../types/socket";
import { generateId } from "../../utils/unique";
import { ErrorFromServer } from "../../utils/error";

export const getRandomRoom = (
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
