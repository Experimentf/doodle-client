import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GameEvents } from '@/constants/Events';
import { useRoom } from '@/contexts/room';
import { useSocket } from '@/contexts/socket';
import { useUser } from '@/contexts/user';
import { HunchInterface, HunchStatus } from '@/types/models/hunch';
import { playCorrectGuessSound } from '@/utils/sounds/soundCorrectGuess';
import { playMessageSentSound } from '@/utils/sounds/soundMessageSent';

interface HunchContextInterface {
  hunches: HunchInterface[];
  sendHunch: (message: string) => Promise<void>;
}

const HunchContext = createContext<HunchContextInterface>({
  hunches: [],
  sendHunch: () => Promise.resolve(),
});

// One history and one socket listener shared by every hunch view, so switching
// layouts (e.g. rotating a tablet) neither loses messages nor doubles sounds.
const HunchProvider = ({ children }: PropsWithChildren) => {
  const { room } = useRoom();
  const {
    user: { id },
  } = useUser();
  const { asyncEmitEvent, registerEvent, unregisterEvent } = useSocket();
  const [hunches, setHunches] = useState<HunchInterface[]>([
    { isSystemMessage: true, message: 'Your hunches go here!' },
  ]);

  const handleOnReceiveHunch = ({
    hunch: hunchResponse,
  }: {
    hunch: HunchInterface;
  }) => {
    setHunches((prev) => [...prev, hunchResponse]);
    // Only a genuine correct guess gets the celebratory sound - other
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

  useEffect(() => {
    registerEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    return () => {
      unregisterEvent(GameEvents.ON_GAME_HUNCH, handleOnReceiveHunch);
    };
  }, []);

  return (
    <HunchContext.Provider value={{ hunches, sendHunch }}>
      {children}
    </HunchContext.Provider>
  );
};

export const useHunches = () => useContext(HunchContext);

export default HunchProvider;
