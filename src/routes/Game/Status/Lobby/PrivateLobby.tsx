import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';

import Button from '@/components/Button';
import Text from '@/components/Text';
import { GameEvents } from '@/constants/Events';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { PrivateGameOptions } from '@/types/socket/game';

const PrivateLobby = () => {
  const {
    room: { id },
  } = useRoom();
  const { setGame } = useGame();
  const { asyncEmitEvent } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PrivateGameOptions>({
    drawing: 120,
    round: 3,
  });

  const drawingTimeOptions = Array(10)
    .fill(0)
    .map((_, index) => (index + 1) * 30);

  const roundOptions = Array(10)
    .fill(0)
    .map((_, index) => index + 1);

  const handleSettingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setOptions((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStart: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { game } = await asyncEmitEvent(
        GameEvents.EMIT_GAME_START_PRIVATE_GAME,
        {
          roomId: id,
          options,
        }
      );
      setGame(game);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="max-w-xs w-full flex flex-col justify-center items-center gap-4"
      onSubmit={handleStart}
    >
      <Text component="h1" className="text-xl">
        Settings
      </Text>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="p-4">
              <label>Drawing Time</label>
            </td>
            <td className="p-4">
              <select
                name="drawing"
                className="w-full bg-transparent border-b-2 outline-none focus:border-b-chalk-blue transition-colors"
                value={options.drawing}
                onChange={handleSettingChange}
              >
                {drawingTimeOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    className="bg-light-board-green text-chalk-white"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td className="p-4">
              <label>Rounds</label>
            </td>
            <td className="p-4">
              <select
                name="round"
                className="w-full bg-transparent border-b-2 outline-none focus:border-b-chalk-blue transition-colors"
                value={options.round}
                onChange={handleSettingChange}
              >
                {roundOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    className="bg-light-board-green text-chalk-white"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <Button
        type="submit"
        color="secondary"
        className="w-full"
        loading={isLoading}
      >
        Start
      </Button>
    </form>
  );
};

export default PrivateLobby;
