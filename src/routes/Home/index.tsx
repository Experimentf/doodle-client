import { FaLock } from 'react-icons/fa6';

import { ReactComponent as Brand } from '@/assets/brand.svg';
import Loading from '@/components/Loading';
import Text from '@/components/Text';
import texts from '@/constants/texts';
import { SocketConnectionState, useSocket } from '@/contexts/socket';
import useScreenSize from '@/hooks/useScreenSize';

import Bubble from '../Game/components/Bubble';
import PlayForm from './components/PlayForm';

const Home = () => {
  const isMobile = useScreenSize('mobile');
  const { socketConnectionState } = useSocket();
  const searchParams = new URLSearchParams(document.location.search);
  const roomIdFromLink = searchParams.get('roomId'); // null | existing room | non-existing room

  const isLoading = [
    SocketConnectionState.CONNECTING,
    SocketConnectionState.RECONNECTING,
  ].includes(socketConnectionState);
  const isError = socketConnectionState === SocketConnectionState.ERROR;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 lg:mx-8">
      <Brand className={isMobile ? 'w-[18rem]' : 'w-[32rem]'} />
      {isLoading || isError ? (
        isLoading ? (
          <Loading />
        ) : (
          <Text color="error" className="text-center text-xs">
            {texts.home.form.validation.connect_error}
          </Text>
        )
      ) : (
        <>
          <PlayForm roomId={roomIdFromLink} className="w-[380px] flex-1" />
          {roomIdFromLink && roomIdFromLink.length > 0 && (
            <Bubble>
              <FaLock />
              <Text className="text-center text-sm" color="primary">
                {texts.home.privateRoomBubble}
                <Text component="span" color="warning">
                  {roomIdFromLink}
                </Text>
              </Text>
            </Bubble>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
