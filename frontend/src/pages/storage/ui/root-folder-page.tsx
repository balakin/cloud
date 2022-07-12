import { Stack } from '@mui/material';
import { AuthGuard } from 'entities/viewer';
import { CreateFolderButton } from 'features/create-folder';
import { UploadFileButton, UploadFilesDnd } from 'features/upload-files';
import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { useUnitRoutes } from 'shared/contexts/unit-routes-context';
import { Page, PageContainer } from 'shared/ui/page';
import { FolderChildrenTable } from 'widgets/folder-children-table';
import { StorageRoutes } from '../types';
import { StorageToolbar } from './storage-toolbar';

export type RootFolderPageProps = {};

export const RootFolderPage: FC<RootFolderPageProps> = () => {
  return (
    <AuthGuard role="user">
      <Page>
        <Helmet>
          <title>Cloud</title>
        </Helmet>
        <UploadFilesDnd folderId={null}>
          <PageContainer>
            <Content />
          </PageContainer>
        </UploadFilesDnd>
      </Page>
    </AuthGuard>
  );
};

export const Content: FC = () => {
  const routes = useUnitRoutes<StorageRoutes>();

  return (
    <Stack spacing={2}>
      <StorageToolbar>
        <CreateFolderButton parentId={null} />
        <UploadFileButton folderId={null} />
      </StorageToolbar>
      <FolderChildrenTable id={null} usedRoutes={routes} />
    </Stack>
  );
};
