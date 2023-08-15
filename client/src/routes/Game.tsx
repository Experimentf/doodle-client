import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { Events } from "../constants/Events";
import useSnackbar from "../hooks/useSnackbar";
import Snackbar from "../components/Snackbar/Snackbar";

const Game = () => {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const {
        message: snackbarMessage,
        close: closeSnackbar,
        isOpen: isSnackbarOpen,
        open: openSnackbar,
        color: snackbarColor,
    } = useSnackbar();

    useEffect(() => {
        if (!socket || !socket.connected) {
            openSnackbar({
                message: "Could not connect.",
                color: "error",
                isInfinite: true,
            });
            return;
        }
        setLoading(true);
        socket.emit(Events.GET_USERNAME, (name: string, error: Error) => {
            console.log(name, error);

            if (error) {
                openSnackbar({ message: error.message, color: "error" });
                setLoading(false);
                return;
            }
            setLoading(false);
        });
    }, [roomId, socket]);

    // if (error) return <ErrorTypography message={error} />;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Game</h1>
            <Snackbar
                message={snackbarMessage}
                handleClose={closeSnackbar}
                open={isSnackbarOpen}
                color={snackbarColor}
            />
        </div>
    );
};

export default Game;
