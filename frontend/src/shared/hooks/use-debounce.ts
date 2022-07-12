import { useEffect, useState } from 'react';

const DELAY = 1000;

export function useDebounce<T>(value: T, delay: number = DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}
