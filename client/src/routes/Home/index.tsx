import Title from '@/components/Title';

import UserForm from './components/UserForm';

const Home = () => {
  const searchParams = new URLSearchParams(document.location.search);
  const roomIdFromLink = searchParams.get('roomId'); // null | existing room | non-existing room

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <Title className="mt-16" />
      <UserForm roomId={roomIdFromLink} className="mb-40" />
    </div>
  );
};

export default Home;
