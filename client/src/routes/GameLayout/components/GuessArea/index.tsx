import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

const GuessArea = () => {
  const [guess, setGuess] = useState('');
  const [guessList, setGuessList] = useState<string[]>(Array(100).fill('abc'));

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
        <ul className="my-2 flex-grow h-[calc(100vh-326px)] overflow-y-scroll">
          {guessList.map((g, index) => (
            <li key={index}>{g}</li>
          ))}
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
            Press enter to guess
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuessArea;
