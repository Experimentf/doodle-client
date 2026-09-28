/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import Snackbar from '@/components/Snackbar';
import { ColorType } from '@/types/styles';

const DEFAULT_DURATION = 3000;
const DEFAULT_COLOR = 'primary';

type OpenSnackbarAttributes = {
  message?: string;
  color?: ColorType;
  duration?: number;
};

const SnackbarContext = createContext({
  openSnackbar: (_: OpenSnackbarAttributes) => {},
  closeSnackbar: () => {},
});

const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [mount, setMount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [color, setColor] = useState<ColorType>(DEFAULT_COLOR);

  const open = ({
    message: newMessage = 'Something went wrong!',
    color: newColor = DEFAULT_COLOR,
    duration: newDuration = DEFAULT_DURATION,
  }: OpenSnackbarAttributes) => {
    setMount(!mount);
    setIsOpen(true);
    setMessage(newMessage);
    setTimestamp(Date.now());
    // Always set (with defaults) so options from a still-open snackbar don't leak into this one.
    setColor(newColor);
    setDuration(newDuration);
  };

  const close = () => {
    setIsOpen(false);
    setDuration(DEFAULT_DURATION);
    setColor(DEFAULT_COLOR);
  };

  useEffect(() => {
    if (isOpen) timerRef.current = setTimeout(close, duration);
    return () => clearTimeout(timerRef.current);
  }, [isOpen, duration, timestamp, mount]);

  return (
    <SnackbarContext.Provider
      value={{ openSnackbar: open, closeSnackbar: close }}
    >
      {children}
      <Snackbar
        message={message}
        handleClose={close}
        open={isOpen}
        color={color}
        duration={duration}
        timestamp={timestamp}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

export default SnackbarProvider;
