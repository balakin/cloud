import { CircularProgress, Typography } from '@mui/material';
import { AuthGuard, useViewer, ViewerUserName } from 'entities/viewer';
import { LogoutButton } from 'features/logout';
import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { Page, PageContainer } from 'shared/ui/page';

export const AccountPage: FC = () => {
  const viewer = useViewer();

  return (
    <AuthGuard role="user">
      <Page>
        <Helmet>
          <title>Account | Cloud</title>
        </Helmet>
        <PageContainer>
          {viewer ? (
            <>
              <Typography variant="h3">
                <ViewerUserName />
              </Typography>
              <LogoutButton />
            </>
          ) : (
            <CircularProgress />
          )}
        </PageContainer>
      </Page>
    </AuthGuard>
  );
};
