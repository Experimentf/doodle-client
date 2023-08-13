import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import Button from "../Button/Button";
import { UserContext } from "../../contexts/UserContext";
import { SocketContext } from "../../contexts/SocketContext";
import { Events } from "../../constants/Events";

interface UserFormProps {
    handlePlay: () => void;
    handleCreatePrivateRoom: () => void;
}

const UserForm = ({ handlePlay, handleCreatePrivateRoom }: UserFormProps) => {
    const { name, updateName, saveName } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const [error, setError] = useState("");

    const setup = () => {
        if (!validate()) return;
        saveName(name);
        socket.connect();
        socket.emit(Events.SET_USERNAME, name);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    const validate = () => {
        if (!name) {
            setError("Please enter your name");
            return false;
        }
        return true;
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError("");
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
                    onClick={() => {
                        setup();
                        handlePlay();
                    }}
                >
                    Play!
                </Button>
                <Button
                    variant="secondary"
                    color="secondary"
                    onClick={() => {
                        setup();
                        handleCreatePrivateRoom();
                    }}
                >
                    Create private room
                </Button>
                <p
                    className={`text-center text-light-chalk-pink ${
                        error ? "block" : "hidden"
                    }`}
                >
                    {error}
                </p>
            </form>
        </div>
    );
};

export default UserForm;
