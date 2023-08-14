import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { Events } from "../constants/Events";

const Game = () => {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(
        socket.connected ? "" : "You are on the wrong page!"
    );

    useEffect(() => {
        if (!socket) return;
        setLoading(true);
        socket.emit(Events.GET_USERNAME, (name: string, error: Error) => {
            console.log(name, error);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            setLoading(false);
        });
    }, [roomId, socket]);

    // if (error) return <ErrorTypography message={error} />;

    if (loading) return <div>Loading...</div>;

    return <div>Game</div>;
};

export default Game;
