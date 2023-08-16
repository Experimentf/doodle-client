import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { Events } from "../constants/Events";
import { MemberType } from "../types/game";

const Game = () => {
    const mountRef = useRef(false);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const { open: openSnackbar } = useContext(SnackbarContext);
    const [members, setMembers] = useState<Array<MemberType>>([]);

    const returnToHomePage = () => navigate("/", { replace: true });

    const getGameDetails = () => {
        socket.emit(
            Events.GET_GAME_DETAILS,
            roomId,
            (
                data: {
                    isWaiting: boolean;
                    type: "public" | "private";
                    members: [MemberType];
                },
                error: Error
            ) => {
                if (error) {
                    openSnackbar({ message: error.message, color: "error" });
                    returnToHomePage();
                    return;
                }
                if (data.isWaiting) {
                    navigate(`/${roomId}/lobby`, { replace: true });
                    return;
                }
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
    };

    useEffect(() => {
        if (mountRef.current) return;
        if (!socket || !socket.connected) {
            openSnackbar({
                message: "Something went wrong!",
                color: "error",
            });
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
            {members.map((member) => (
                <p key={member.id}>{member.name}</p>
            ))}
        </div>
    );
};

export default Game;
