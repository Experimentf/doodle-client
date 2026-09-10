import { useEffect, useState } from 'react';
import { FaLock } from 'react-icons/fa6';

import AnimatedBrand from '@/components/AnimatedBrand';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import SoundToggle from '@/components/SoundToggle';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import useScreenSize from '@/hooks/useScreenSize';

import Bubble from '../Game/components/Bubble';
import AboutSection from './components/AboutSection';
import HowToPlaySection from './components/HowToPlaySection';
import PlayForm from './components/PlayForm';

const Home = () => {
  const isMobile = useScreenSize('mobile');
  const { socketConnectionState, retryConnection } = useSocket();
  const searchParams = new URLSearchParams(document.location.search);
  const roomIdFromLink = searchParams.get('roomId'); // null | existing room | non-existing room
  const [dismissedError, setDismissedError] = useState(false);

  const isLoading = [
    SocketConnectionState.CONNECTING,
    SocketConnectionState.RECONNECTING,
  ].includes(socketConnectionState);
  const isError = socketConnectionState === SocketConnectionState.ERROR;

  // Re-arm the dialog for a fresh failure once a new attempt (retry) starts.
  useEffect(() => {
    if (!isError) setDismissedError(false);
  }, [isError]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 p-6 lg:mx-8">
      <div className="fixed top-4 right-4">
        <SoundToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <AnimatedBrand
          loading={isLoading}
          className={`mt-8 ${isMobile ? 'w-[18rem]' : 'w-[32rem]'}`}
        />
        <PlayForm
          roomId={roomIdFromLink}
          className="w-[380px] flex-1"
          disableActions={isError && dismissedError}
        />
        {roomIdFromLink && roomIdFromLink.length > 0 && (
          <div className="w-full max-w-[380px]">
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
        visible={isError && !dismissedError}
        onClose={() => setDismissedError(true)}
        title="Connection lost"
        footer={
          <>
            <Button
              variant="secondary"
              color="primary"
              onClick={() => setDismissedError(true)}
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
