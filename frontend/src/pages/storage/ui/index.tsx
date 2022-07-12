import { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UnitRoutesProvider } from 'shared/contexts/unit-routes-context';
import { StorageRoutes } from '../types';
import { FolderPage } from './folder-page';
import { RootFolderPage } from './root-folder-page';

export type StoragePageProps = {
  usedRoutes: StorageRoutes;
};

export const StoragePage: FC<StoragePageProps> = ({ usedRoutes }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      setSearchParams({ id: 'root' }, { replace: true });
    }
  }, [id, setSearchParams]);

  if (!id) {
    return null;
  }

  return (
    <UnitRoutesProvider routes={usedRoutes}>{id === 'root' ? <RootFolderPage /> : <FolderPage />}</UnitRoutesProvider>
  );
};
