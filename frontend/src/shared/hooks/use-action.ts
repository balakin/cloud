import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMountedRef } from './use-is-mounted-ref';

export function useAction(action: () => Promise<void> | void) {
  const [pending, setPending] = useState(false);
  const isMountedRef = useIsMountedRef();
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const memoizedAction = useCallback(async () => {
    setPending(true);
    try {
      actionRef.current();
    } catch (error) {
      // TODO: catch error
      console.error(error);
    } finally {
      if (isMountedRef.current) {
        setPending(false);
      }
    }
  }, [isMountedRef]);

  return {
    pending,
    action: memoizedAction,
  };
}
