import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useState,
} from 'react';
import { GameContext } from '../../../../contexts/GameContext';
import Avatar from '../../../../components/Avatar/Avatar';

const GuessArea = () => {
  const { members } = useContext(GameContext);
  const [guess, setGuess] = useState('');
  const [guessList, setGuessList] = useState(
    Array(5).fill({
      senderId: 'oX8r62K9Ef1HOsvfAAAr',
      message: 'abcdef',
      status: 'error',
    })
  );

  const getAvatarBySenderId = (id: string) => {
    const member = members.find(({ id: mId }) => mId === id);
    if (!member) return null;
    return member.avatar;
  };

  const handleSendGuess: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return;
    setGuessList((prev) => [...prev, guess]);
    setGuess('');
  };

  const handleChangeGuess: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGuess(e.target.value);
  };

  return (
    <div className="max-w-[96]">
      <div className="p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col">
        <h1 className="text-lg whitespace-nowrap">hunch time !</h1>
        <hr className="my-2" />
        <ul className="my-2 flex-grow h-[calc(100vh-326px)] overflow-y-scroll bg-scroll">
          {guessList.map((g, index) => {
            const avatarProps = getAvatarBySenderId(g.senderId);
            if (!avatarProps) return null;
            return (
              <li key={index} className="flex flex-row items-center">
                <Avatar avatarProps={avatarProps} className="w-6" />
                <span
                  className={
                    g.status === 'error'
                      ? 'text-light-chalk-pink text-xs'
                      : g.status
                      ? 'text-light-chalk-green text-xs'
                      : 'text-chalk-white text-xs'
                  }
                >
                  {g.message}
                </span>
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
