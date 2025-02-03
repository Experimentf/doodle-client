import { useEffect, useMemo, useState } from 'react';

const DEFAULT_SCREEN_WIDTH_START = {
  mobile: 700,
  desktop: Infinity,
};

const useScreenSize = (query: keyof typeof DEFAULT_SCREEN_WIDTH_START) => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const queryResult = useMemo(() => {
    switch (query) {
      case 'mobile':
        return width <= DEFAULT_SCREEN_WIDTH_START['mobile'];
      case 'desktop':
        return width > DEFAULT_SCREEN_WIDTH_START['mobile'];
      default:
        return false;
    }
  }, [width]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return queryResult;
};

export default useScreenSize;
