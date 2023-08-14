import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { UserContext } from "../../contexts/UserContext";
import { SocketContext } from "../../contexts/SocketContext";
import { Events } from "../../constants/Events";
import Snackbar from "../Snackbar/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";

interface UserFormProps {
    roomId: string | null;
}

const UserForm = ({ roomId }: UserFormProps) => {
    const navigate = useNavigate();
    const { name, updateName, saveName } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const {
        color: snackbarColor,
        message: snackbarMessage,
        isOpen: isSnackbarOpen,
        open: openSnackbar,
        close: closeSnackbar,
    } = useSnackbar();

    const validate = () => {
        if (!name) {
            openSnackbar("Please enter your name", "error");
            return false;
        }
        return true;
    };

    const setup = () => {
        if (!validate()) return;
        saveName(name);
        socket.connect();
        socket.emit(Events.SET_USERNAME, name);
    };

    const handlePlayPublicGame = () => {
        socket.emit(
            Events.PLAY_PUBLIC_GAME,
            (publicRoomId: string, error: Error) => {
                if (error) {
                    openSnackbar(error.message);
                    return;
                }
                navigate(`/${publicRoomId}`);
            }
        );
    };

    const handlePlayGame = () => {};

    const handlePlay = () => {
        setup();
        if (!roomId) handlePlayPublicGame();
        else handlePlayGame();
    };

    const handleCreatePrivateRoom = () => {
        setup();
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
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
                <Snackbar
                    open={isSnackbarOpen}
                    message={snackbarMessage}
                    color={snackbarColor}
                    handleClose={closeSnackbar}
                />
            </form>
        </div>
    );
};

export default UserForm;
