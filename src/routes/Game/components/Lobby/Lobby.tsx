import React, { useContext } from 'react';

import { GameContext } from '@/contexts/GameContext';

const Lobby = () => {
  const game = useContext(GameContext);
  const lobbyDetails = {
    capacity: ['Maximum players', game.room.capacity],
    lang: ['Language', 'English'],
    drawTime: ['Time to Draw', 120],
    rounds: ['Rounds', 3],
    hints: ['Hints', 1],
  };

  return (
    <div className="flex-grow">
      <div className="w-full p-4 rounded-lg flex flex-col items-center">
        <div className="py-8 px-12 inline-block text-xl text-board-green bg-chalk-white rounded-xl -rotate-6 shadowed">
          <h1>Lobby</h1>
        </div>
        <table className="mt-10">
          <tbody>
            {Object.keys(lobbyDetails).map((key, index) => {
              const lobbyDetailKey = key as keyof typeof lobbyDetails;
              return (
                <tr key={index}>
                  <td className="text-light-chalk-white py-2">
                    {lobbyDetails[lobbyDetailKey][0]}
                  </td>
                  <td className="px-10 py-2" />
                  <td className="text-chalk-white py-2">
                    {lobbyDetails[lobbyDetailKey][1]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {game.room.type === 'public' && (
          <div className="mt-10 text-chalk-yellow">
            <p>Waiting for players to join . . .</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
