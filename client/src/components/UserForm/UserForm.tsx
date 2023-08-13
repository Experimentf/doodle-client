import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { UserContext } from "../../contexts/UserContext";
import { SocketContext } from "../../contexts/SocketContext";
import { Events } from "../../constants/Events";

const UserForm = () => {
    const navigate = useNavigate();
    const { name, updateName, saveName } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const [error, setError] = useState("");

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    // Play in public room
    const handlePlay = () => {
        saveName(name);
    };

    // Create a private room
    const handleCreatePrivateRoom = () => {
        saveName(name);
        socket.emit(
            Events.CREATE_PRIVATE_ROOM,
            (data: { roomId: string; ownerId: string }, error?: Error) => {
                console.log(data, error);

                if (error) {
                    console.log(error);
                    setError(error.message);
                    return;
                }
                navigate(`/${data.roomId}/lobby`, { replace: true });
            }
        );
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateName(e.target.value);
    };

    return (
        <div>
            <form
                className="p-8 rounded-xl flex flex-col gap-8"
                onSubmit={handleFormSubmit}
            >
                <input
                    autoFocus
                    type="text"
                    placeholder="Type your name"
                    className="bg-transparent border-chalk-white border-b-4 placeholder-light-chalk-white p-2 outline-none text-center text-chalk-white"
                    value={name}
                    onChange={handleNameChange}
                />
                <Button
                    variant="secondary"
                    color="success"
                    onClick={handlePlay}
                >
                    Play!
                </Button>
                <Button
                    variant="secondary"
                    color="secondary"
                    onClick={handleCreatePrivateRoom}
                >
                    Create private room
                </Button>
                {error && <p className="text-chalk-pink">{error}</p>}
            </form>
        </div>
    );
};

export default UserForm;
