import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { Events } from "../../constants/Events";
import { GameStatus, MemberType, Room, RoomType } from "../../types/game";
import Lobby from "./Lobby/Lobby";
import End from "./End/End";
import Title from "../../components/Title/Title";
import Game from "./Game/Game";
import MemberList from "../../components/MemberList/MemberList";

const GameLayout = () => {
    const mountRef = useRef(false);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const { open: openSnackbar } = useContext(SnackbarContext);
    const [members, setMembers] = useState<Array<MemberType>>([]);
    const [room, setRoom] = useState<Room>({
        status: "lobby",
        type: "public",
        capacity: 0,
    });

    const getLayout = (status: GameStatus, members: MemberType[]) => {
        if (status === "game") return <Game members={members} />;
        if (status === "lobby") return <Lobby room={room} members={members} />;
        return <End members={members} />;
    };

    const returnToHomePage = () => navigate("/", { replace: true });

    const getGameDetails = () => {
        socket.emit(
            Events.GET_GAME_DETAILS,
            roomId,
            (
                data: {
                    capacity: number;
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

                setRoom({
                    status: data.status,
                    type: data.type,
                    capacity: data.capacity,
                });
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
            setRoom((prev) => ({ ...prev, status: "game" }));
        });

        // When a game ends
        socket.on(Events.ON_GAME_END, () => {
            setRoom((prev) => ({ ...prev, status: "end" }));
        });

        // When a game comes to lobby
        socket.on(Events.ON_GAME_LOBBBY, () => {
            setRoom((prev) => ({ ...prev, status: "lobby" }));
        });
    };

    useEffect(() => {
        if (mountRef.current) return;
        if (!socket || !socket.connected) {
            returnToHomePage();
            return;
        }
        setLoading(true);

        socket.emit(
            Events.GET_USER,
            ({ name }: { name: string }, error: Error) => {
                if (error || !name) {
                    openSnackbar({ message: error.message, color: "error" });
                    returnToHomePage();
                    return;
                }
                getGameDetails();
                handleEvents();
                setLoading(false);
            }
        );
        mountRef.current = true;
    }, [roomId, socket]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <div className="p-4">
                <Title small />
            </div>
            <div className="p-4 flex gap-8">
                <MemberList userId={socket.id} members={members} />
                {getLayout(room.status, members)}
            </div>
        </div>
    );
};

export default GameLayout;
