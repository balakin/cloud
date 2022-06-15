import { useContext } from 'react';
import { usePersistentStore } from 'shared/hooks';
import { IS_AUTH_KEY } from './constants';
import { ViewerContext } from './contexts';

function useViewerContext() {
  return useContext(ViewerContext);
}

export function useViewer() {
  const context = useViewerContext();
  return context?.viewer ?? null;
}

export function useIsAuth() {
  return usePersistentStore<boolean>(IS_AUTH_KEY);
}

export function useViewerRefetch() {
  const context = useViewerContext();

  if (!context) {
    throw new Error('No context');
  }

  return context!.refetch;
}
