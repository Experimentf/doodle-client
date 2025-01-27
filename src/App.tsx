import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorBoundary from './components/Error/ErrorBoundary';
import texts from './constants/texts';
import GameProvider from './contexts/game/GameContext';
import SnackbarProvider from './contexts/SnackbarContext';
import SocketProvider from './contexts/socket/SocketContext';
import UserProvider from './contexts/user/UserContext';
import Game from './routes/Game';
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
          <Game />
        </GameProvider>
      ),
    },
  ]);

  return (
    <div>
      <ErrorBoundary fallback={<p>{texts.common.error.fallbackText}</p>}>
        <SnackbarProvider>
          <UserProvider>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </UserProvider>
        </SnackbarProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
