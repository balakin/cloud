import { AuthGuard } from 'entities/viewer';
import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { Page, PageContainer } from 'shared/ui/page';
import { ViewerInfo } from 'widgets/viewer-info';

export const AccountPage: FC = () => {
  return (
    <AuthGuard role="user">
      <Page>
        <Helmet>
          <title>Account | Cloud</title>
        </Helmet>
        <PageContainer>
          <ViewerInfo />
        </PageContainer>
      </Page>
    </AuthGuard>
  );
};
