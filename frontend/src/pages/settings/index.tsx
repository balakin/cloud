import { Stack } from '@mui/material';
import { AuthGuard } from 'entities/viewer';
import { ChangePasswordIconButton } from 'features/change-password';
import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { InfoBlock } from 'shared/ui/blocks';
import { Page, PageContainer } from 'shared/ui/page';
import { ViewerInfo } from 'widgets/viewer-info';

export type SettingsPageProps = {};

export const SettingsPage: FC<SettingsPageProps> = () => {
  return (
    <AuthGuard role="user">
      <Page>
        <Helmet>
          <title>Settings | Cloud</title>
        </Helmet>
        <PageContainer>
          <Stack spacing={2}>
            <ViewerInfo />
            <InfoBlock label="Password" value="***********" actions={<ChangePasswordIconButton iconSize="1.25rem" />} />
          </Stack>
        </PageContainer>
      </Page>
    </AuthGuard>
  );
};
