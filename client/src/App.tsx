import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SocketProvider from './contexts/SocketContext';
import UserProvider from './contexts/UserContext';
import Home from './routes/Home';
import GameLayout from './routes/GameLayout';
import SnackbarProvider from './contexts/SnackbarContext';
import './App.css';
import GameProvider from './contexts/GameContext';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: ':roomId',
      element: (
        <GameProvider>
          <GameLayout />
        </GameProvider>
      ),
    },
  ]);

  return (
    <div>
      <SnackbarProvider>
        <UserProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </UserProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
