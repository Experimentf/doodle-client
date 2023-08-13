import { useContext } from "react";
import "./App.css";
import Title from "./components/Title/Title";
import UserForm from "./components/UserForm/UserForm";
import SocketProvider, { SocketContext } from "./contexts/SocketContext";
import UserProvider from "./contexts/UserContext";
import { Events } from "./constants/Events";

function Main() {
    const socket = useContext(SocketContext);
    const handlePlay = () => {
        socket.emit(Events.PLAY_PUBLIC_GAME, (roomId: string, error: Error) => {
            if (error) {
                // TODO
                // Use error boundary
                throw error;
            }
            console.log(roomId);
        });
    };

    const handleCreatePrivateRoom = () => {};

    return (
        <div className="flex flex-col items-center justify-between gap-16">
            <Title className="mt-16" />
            <UserForm
                handlePlay={handlePlay}
                handleCreatePrivateRoom={handleCreatePrivateRoom}
            />
        </div>
    );
}

function App() {
    const searchParams = new URLSearchParams(document.location.search);
    const roomId = searchParams.get("room"); // null | existing room | non-existing room

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <UserProvider>
                <SocketProvider>
                    <Main />
                </SocketProvider>
            </UserProvider>
        </div>
    );
}

export default App;
