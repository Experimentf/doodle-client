import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import GameProvider from './contexts/GameContext';
import SnackbarProvider from './contexts/SnackbarContext';
import SocketProvider from './contexts/SocketContext';
import UserProvider from './contexts/UserContext';
import GameLayout from './routes/GameLayout';
import Home from './routes/Home';

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
