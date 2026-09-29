import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GameEvents } from '@/constants/Events';
import { useGame } from '@/contexts/game';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { playCorrectGuessSound } from '@/utils/sounds/soundCorrectGuess';
import { playMessageSentSound } from '@/utils/sounds/soundMessageSent';

interface HunchContextInterface {
  hunches: HunchInterface[];
  sendHunch: (message: string) => Promise<void>;
  // Doodlers who hunched the word this turn
  hunchedIds: Set<string>;
}

const HunchContext = createContext<HunchContextInterface>({
  hunches: [],
  sendHunch: () => Promise.resolve(),
  hunchedIds: new Set(),
});

// One history and one socket listener shared by every hunch view, so switching
// layouts (e.g. rotating a tablet) neither loses messages nor doubles sounds.
const HunchProvider = ({ children }: PropsWithChildren) => {
  const { room } = useRoom();
  const {
    user: { id },
  } = useUser();
  const { asyncEmitEvent, registerEvent, unregisterEvent } = useSocket();
  const { game } = useGame();
  const [hunchedIds, setHunchedIds] = useState<Set<string>>(new Set());
  const [hunches, setHunches] = useState<HunchInterface[]>([
    { isSystemMessage: true, message: 'Your hunches go here!' },
  ]);

  const handleOnReceiveHunch = ({
    hunch: hunchResponse,
  }: {
    hunch: HunchInterface;
  }) => {
    setHunches((prev) => [...prev, hunchResponse]);
    const { guesserId } = hunchResponse;
    if (hunchResponse.status === HunchStatus.CORRECT && guesserId)
      setHunchedIds((prev) => new Set(prev).add(guesserId));
    // Only a genuine correct hunch gets the celebratory sound - other
    // system messages (e.g. "not enough players") stay silent instead of
    // playing a mismatched success cue.
    if (hunchResponse.status === HunchStatus.CORRECT) playCorrectGuessSound();
    else if (hunchResponse.senderId === id) playMessageSentSound();
  };

  const sendHunch = async (message: string) => {
    const data = await asyncEmitEvent(GameEvents.EMIT_GAME_HUNCH, {
      roomId: room.id,
      message,
    });
    handleOnReceiveHunch(data);
  };

  // Each game snapshot is authoritative (and resets at turn start); correct hunches add to it live.
  useEffect(() => {
    setHunchedIds(new Set(game.hunchedIds ?? []));
  }, [game]);

  useEffect(() => {
    registerEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    return () => {
      unregisterEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    };
  }, []);

  return (
    <HunchContext.Provider value={{ hunches, sendHunch, hunchedIds }}>
      {children}
    </HunchContext.Provider>
  );
};

export const useHunches = () => useContext(HunchContext);

export default HunchProvider;
