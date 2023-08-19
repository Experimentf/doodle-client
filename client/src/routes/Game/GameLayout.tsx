import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { Events } from "../../constants/Events";
import { GameStatus, MemberType, RoomType } from "../../types/game";
import Lobby from "./Lobby/Lobby";
import End from "./End/End";

const Game = () => {
    const mountRef = useRef(false);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const { open: openSnackbar } = useContext(SnackbarContext);
    const [members, setMembers] = useState<Array<MemberType>>([]);
    const [room, setRoom] = useState<{ status: GameStatus; type: RoomType }>({
        status: "lobby",
        type: "public",
    });

    const returnToHomePage = () => navigate("/", { replace: true });

    const getGameDetails = () => {
        socket.emit(
            Events.GET_GAME_DETAILS,
            roomId,
            (
                data: {
                    status: GameStatus;
                    type: RoomType;
                    members: [MemberType];
                },
                error: Error
            ) => {
                if (error) {
                    openSnackbar({ message: error.message, color: "error" });
                    returnToHomePage();
                    return;
                }

                setRoom({ status: data.status, type: data.type });
                setMembers(data.members);
            }
        );
    };

    const handleEvents = () => {
        // When a new member joins the room
        socket.on(Events.ON_NEW_USER, (newMember: MemberType) => {
            setMembers((prev) => [...prev, newMember]);
        });

        // When a member leaves the room
        socket.on(Events.ON_USER_LEAVE, (oldMember: MemberType) => {
            setMembers((prev) =>
                prev.filter((data) => data.id !== oldMember.id)
            );
        });

        // When a game starts
        socket.on(Events.ON_GAME_START, () => {
            setRoom((prev) => ({ type: prev.type, status: "game" }));
        });

        // When a game ends
        socket.on(Events.ON_GAME_END, () => {
            setRoom((prev) => ({ type: prev.type, status: "end" }));
        });
    };

    useEffect(() => {
        if (mountRef.current) return;
        if (!socket || !socket.connected) {
            returnToHomePage();
            return;
        }
        setLoading(true);

        socket.emit(Events.GET_USERNAME, (name: string, error: Error) => {
            if (error) {
                openSnackbar({ message: error.message, color: "error" });
                returnToHomePage();
                return;
            }
            getGameDetails();
            handleEvents();
            setLoading(false);
        });
        mountRef.current = true;
    }, [roomId, socket]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {room.status}
            {/* {renderMainLayout()} */}
            {members.map((member) => (
                <p key={member.id}>{member.name}</p>
            ))}
        </div>
    );
};

export default Game;
