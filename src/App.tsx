import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AmbientBackground from './components/AmbientBackground';
import ErrorBoundary from './components/Error/ErrorBoundary';
import Footer from './components/Footer';
import texts from './constants/texts';
import GameProvider from './contexts/game';
import RoomProvider from './contexts/room';
import SnackbarProvider from './contexts/snackbar';
import SocketProvider from './contexts/socket';
import UserProvider from './contexts/user';
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
        <RoomProvider>
          <GameProvider>
            <Game />
          </GameProvider>
        </RoomProvider>
      ),
    },
  ]);

  return (
    <div>
      <AmbientBackground />
      <ErrorBoundary fallback={<p>{texts.common.error.fallbackText}</p>}>
        <SnackbarProvider>
          <UserProvider>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </UserProvider>
        </SnackbarProvider>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default App;
