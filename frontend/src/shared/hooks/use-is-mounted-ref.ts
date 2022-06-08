import { useEffect, useRef } from 'react';

export function useIsMountedRef() {
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    // components renders twice in strict mode
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
