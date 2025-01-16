import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GameContext } from '../../../../contexts/GameContext';
import Avatar from '../../../../components/Avatar';
import { SocketContext } from '../../../../contexts/SocketContext';
import Text from '../../../../components/Text';

const GuessArea = () => {
  const socket = useContext(SocketContext);
  const { members } = useContext(GameContext);
  const listRef = useRef<HTMLUListElement>(null);
  const [guess, setGuess] = useState('');
  const [guessList, setGuessList] = useState(
    Array(5)
      .fill({})
      .map(() => ({
        senderId: 'EoRnrDocCsRDSDx8AAAD',
        message: 'abcdef',
        status: Math.random() < 0.5 ? 'error' : 'success',
      }))
  );

  const getAvatarBySenderId = (id: string) => {
    const member = members.find(({ id: mId }) => mId === id);
    if (!member) return null;
    return member.avatar;
  };

  const handleSendGuess: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return;
    setGuessList((prev) => [
      ...prev,
      { message: guess, senderId: socket.id, status: 'success' },
    ]);
    setGuess('');
  };

  const handleChangeGuess: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGuess(e.target.value);
  };

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      top: listRef.current.scrollHeight,
    });
  }, [guessList]);

  return (
    <div className="max-w-[96]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col">
        <h1 className="text-lg whitespace-nowrap text-chalk-white">
          hunch time !
        </h1>
        <hr className="my-2 text-chalk-white" />
        <ul
          ref={listRef}
          className="my-2 flex-grow h-[calc(100vh-326px)] overflow-y-scroll bg-scroll"
        >
          {guessList.map((g, index) => {
            const avatarProps = getAvatarBySenderId(g.senderId);
            if (!avatarProps) return null;
            return (
              <li key={index} className="flex flex-row items-center">
                <Avatar avatarProps={avatarProps} className="w-6" />
                <Text
                  color={g.status as 'error' | 'success'}
                  className="text-xs"
                >
                  {g.message}
                </Text>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col items-end gap-1">
          <input
            type="text"
            value={guess}
            placeholder="Type your hunch ..."
            className="w-full bg-dark-board-green rounded-lg p-2 outline-none text-sm font-thin"
            onKeyDown={handleSendGuess}
            onChange={handleChangeGuess}
          />
          <p className="text-[0.2em] text-light-chalk-white">
            Press enter to hunch
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuessArea;
