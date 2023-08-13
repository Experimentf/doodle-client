import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Lobby from "./routes/Lobby";
import UserProvider from "./contexts/UserContext";
import SocketProvider from "./contexts/SocketContext";

function App() {
    const router = createBrowserRouter([
        { path: "/", element: <Home /> },
        {
            path: "/:roomid/lobby",
            element: <Lobby />,
        },
    ]);

    return (
        <div className="">
            <SocketProvider>
                <UserProvider>
                    <RouterProvider router={router} />
                </UserProvider>
            </SocketProvider>
        </div>
    );
}

export default App;
