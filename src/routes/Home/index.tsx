import Title from '@/components/Title';
import useScreenSize from '@/hooks/useScreenSize';

import PlayForm from './components/PlayForm';

const Home = () => {
  const isMobile = useScreenSize('mobile');
  const searchParams = new URLSearchParams(document.location.search);
  const roomIdFromLink = searchParams.get('roomId'); // null | existing room | non-existing room

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <Title small={isMobile} className="mt-16" />
      <PlayForm roomId={roomIdFromLink} className="mb-40 w-[380px]" />
    </div>
  );
};

export default Home;
