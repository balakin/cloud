import { Stack } from '@mui/material';
import { FolderPath, useFolder } from 'entities/folders';
import { AuthGuard } from 'entities/viewer';
import { CreateFolderButton } from 'features/create-folder';
import { UploadFileButton, UploadFilesDnd } from 'features/upload-files';
import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useUnitRoutes } from 'shared/contexts/unit-routes-context';
import { Page, PageContainer } from 'shared/ui/page';
import { FolderChildrenTable } from 'widgets/folder-children-table';
import { StorageRoutes } from '../types';
import { StorageToolbar } from './storage-toolbar';

export type FolderPageProps = {};

export const FolderPage: FC<FolderPageProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('id');

  useEffect(() => {
    if (!folderId) {
      setSearchParams({ id: 'root' }, { replace: true });
    }
  }, [folderId, setSearchParams]);

  if (!folderId) {
    return null;
  }

  return (
    <AuthGuard role="user">
      <Page>
        <Title />
        <UploadFilesDnd folderId={folderId}>
          <PageContainer>
            <Content />
          </PageContainer>
        </UploadFilesDnd>
      </Page>
    </AuthGuard>
  );
};

const Title: FC = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('id')!;
  const { data } = useFolder(folderId);

  return (
    <Helmet>
      <title>{data ? `${data.name} | Cloud` : 'Cloud'}</title>
    </Helmet>
  );
};

const Content: FC = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('id')!;
  const routes = useUnitRoutes<StorageRoutes>();

  return (
    <Stack spacing={2}>
      <StorageToolbar>
        <CreateFolderButton parentId={folderId} />
        <UploadFileButton folderId={folderId} />
      </StorageToolbar>
      <FolderPath id={folderId} folderRoute={routes.folder} rootRoute={routes.root} />
      <FolderChildrenTable id={folderId} usedRoutes={routes} />
    </Stack>
  );
};
