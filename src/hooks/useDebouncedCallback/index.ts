/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

const useDebounce = (callback: (...args: any[]) => any, timeout = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncer = (...args: Parameters<typeof callback>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback.bind(args), timeout);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return debouncer;
};

export default useDebounce;
