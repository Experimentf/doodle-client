import { useEffect, useState } from 'react';
import { FaLock } from 'react-icons/fa6';

import AnimatedBrand from '@/components/AnimatedBrand';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import SoundToggle from '@/components/SoundToggle';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { SocketConnectionState, useSocket } from '@/contexts/socket';

import Bubble from '../Game/components/Bubble';
import AboutSection from './components/AboutSection';
import HowToPlaySection from './components/HowToPlaySection';
import PlayForm from './components/PlayForm';

const Home = () => {
  const { socketConnectionState, retryConnection } = useSocket();
  const searchParams = new URLSearchParams(document.location.search);
  const roomIdFromLink = searchParams.get('roomId'); // null | existing room | non-existing room
  // Only shown once the player tries to play - an unprompted error dialog on
  // load (a server blip, a redeploy, or a crawler's renderer) is just noise.
  const [showConnectionError, setShowConnectionError] = useState(false);

  const isLoading = [
    SocketConnectionState.CONNECTING,
    SocketConnectionState.RECONNECTING,
  ].includes(socketConnectionState);
  const isError = socketConnectionState === SocketConnectionState.ERROR;

  useEffect(() => {
    if (socketConnectionState === SocketConnectionState.CONNECTED)
      setShowConnectionError(false);
  }, [socketConnectionState]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 lg:mx-8">
      <div className="fixed top-4 right-4">
        <SoundToggle />
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <AnimatedBrand
          dropIn
          loading={isLoading}
          className="mt-4 w-[16rem] sm:w-[24rem]"
        />
        <PlayForm
          roomId={roomIdFromLink}
          className="w-full max-w-[360px]"
          onConnectionError={() => setShowConnectionError(true)}
        />
        {roomIdFromLink && roomIdFromLink.length > 0 && (
          <div className="w-full max-w-[360px]">
            <Bubble>
              <FaLock className="shrink-0" />
              <Text className="text-left text-sm" color="primary">
                {texts.home.privateRoomBubble}
                <Text component="span" color="warning">
                  {roomIdFromLink}
                </Text>
              </Text>
            </Bubble>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <HowToPlaySection />
        <AboutSection />
      </div>
      <Dialog
        // Stays armed through Retry, so a failed retry shows it again.
        visible={isError && showConnectionError}
        onClose={() => setShowConnectionError(false)}
        title="Connection lost"
        footer={
          <>
            <Button
              variant="secondary"
              color="primary"
              onClick={() => setShowConnectionError(false)}
            >
              Close
            </Button>
            <Button
              variant="secondary"
              color="success"
              onClick={retryConnection}
            >
              Retry
            </Button>
          </>
        }
      >
        <Text className="text-center text-sm">
          {texts.home.form.validation.connect_error}
        </Text>
      </Dialog>
    </div>
  );
};

export default Home;
