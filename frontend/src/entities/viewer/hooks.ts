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

export function useRequiredViewer() {
  const context = useViewerContext();

  if (!context || !context.viewer) {
    throw new Error('No viewer');
  }

  return context.viewer;
}

export function useIsAuth() {
  return usePersistentStore<boolean>(IS_AUTH_KEY);
}
