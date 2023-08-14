import SocketProvider from "./contexts/SocketContext";
import UserProvider from "./contexts/UserContext";
import Home from "./routes/Home";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./routes/Game";
import Lobby from "./routes/Lobby";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/:roomId",
            element: <Game />,
        },
        {
            path: "/:roomId/lobby",
            element: <Lobby />,
        },
    ]);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <UserProvider>
                <SocketProvider>
                    <RouterProvider router={router} />
                </SocketProvider>
            </UserProvider>
        </div>
    );
}

export default App;
