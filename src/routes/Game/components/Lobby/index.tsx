import React, { useContext } from 'react';

import texts from '@/constants/texts';
import { GameContext } from '@/contexts/GameContext';

const Lobby = () => {
  const { gameState } = useContext(GameContext);
  const lobbyDetails = {
    capacity: gameState.room.capacity,
    language: 'English',
    drawTime: 120,
    rounds: gameState.maxRounds,
    hints: 1,
  };

  return (
    <div className="flex-grow">
      <div className="w-full p-4 rounded-lg flex flex-col items-center">
        <div className="py-8 px-12 inline-block text-xl text-board-green bg-chalk-white rounded-xl -rotate-6 shadowed">
          <h1>{texts.game.lobby.sectionTitle}</h1>
        </div>
        <table className="mt-10">
          <tbody>
            {Object.keys(lobbyDetails).map((key, index) => {
              const lobbyDetailKey = key as keyof typeof lobbyDetails;
              return (
                <tr key={index}>
                  <td className="text-light-chalk-white py-2">
                    {texts.game.lobby.properties[lobbyDetailKey]}
                  </td>
                  <td className="px-10 py-2" />
                  <td className="text-chalk-white py-2">
                    {lobbyDetails[lobbyDetailKey]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {gameState.room.type === 'public' && (
          <div className="mt-10 text-chalk-yellow">
            <p>{texts.game.lobby.waiting}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
