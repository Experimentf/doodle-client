import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { Events } from "../constants/Events";

const Game = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const { open: openSnackbar } = useContext(SnackbarContext);

    const returnToHomePage = () => navigate("/", { replace: true });

    useEffect(() => {
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
            setLoading(false);
        });
    }, [roomId, socket]);

    if (loading) return <div>Loading...</div>;

    return <div>Game</div>;
};

export default Game;
