/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

import Snackbar from '@/components/Snackbar';
import { ColorType } from '@/types/styles';

const DEFAULT_DURATION = 3000;
const DEFAULT_COLOR = 'primary';

type OpenSnackbarAttributes = {
  message: string;
  color?: ColorType;
  duration?: number;
  isInfinite?: boolean;
};

export const SnackbarContext = createContext({
  open: (_: OpenSnackbarAttributes) => {},
});

const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [mount, setMount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [color, setColor] = useState<ColorType>(DEFAULT_COLOR);
  const [isInfinite, setIsInfinite] = useState(false);

  const open = ({
    message: newMessage,
    color: newColor,
    duration: newDuration,
    isInfinite: newIsInfinite,
  }: OpenSnackbarAttributes) => {
    setMount(!mount);
    setIsOpen(true);
    setMessage(newMessage);
    setTimestamp(Date.now());
    if (newColor) setColor(newColor);
    if (newDuration) setDuration(newDuration);
    if (newIsInfinite) setIsInfinite(newIsInfinite);
  };

  const close = () => {
    setIsOpen(false);
    setDuration(DEFAULT_DURATION);
    setColor(DEFAULT_COLOR);
    setIsInfinite(false);
  };

  useEffect(() => {
    if (isOpen && !isInfinite) timerRef.current = setTimeout(close, duration);
    return () => clearTimeout(timerRef.current);
  }, [isOpen, isInfinite, duration, timestamp, mount]);

  return (
    <SnackbarContext.Provider value={{ open }}>
      {children}
      <Snackbar
        message={message}
        handleClose={close}
        open={isOpen}
        color={color}
        isInfinite={isInfinite}
        duration={duration}
        timestamp={timestamp}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
