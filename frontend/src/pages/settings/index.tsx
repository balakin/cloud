import { Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AuthGuard, ViewerUserName } from 'entities/viewer';
import { AvatarSelector, ChangeAvatarButton } from 'features/change-avatar';
import { DeleteAvatarButton } from 'features/change-avatar/ui/delete-avatar-button';
import { ChangePasswordButton } from 'features/change-password';
import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { ActionsBlock } from 'shared/ui/blocks';
import { Page, PageContainer } from 'shared/ui/page';

export type SettingsPageProps = {};

export const SettingsPage: FC<SettingsPageProps> = () => {
  return (
    <AuthGuard role="user">
      <Page>
        <Helmet>
          <title>Settings | Cloud</title>
        </Helmet>
        <PageContainer maxWidth="sm">
          <Content />
        </PageContainer>
      </Page>
    </AuthGuard>
  );
};

const Content: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{ padding: 3 }} elevation={8}>
      <Stack spacing={2} direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'center' : undefined}>
        <AvatarSelector width={80} height={80} />
        <Stack spacing={2} textAlign={isMobile ? 'center' : undefined}>
          <Typography variant="h6">
            <ViewerUserName />
          </Typography>
          <ActionsBlock label="Avatar">
            <ChangeAvatarButton size="small" />
            <DeleteAvatarButton size="small" />
          </ActionsBlock>
          <ActionsBlock label="Password">
            <ChangePasswordButton size="small" />
          </ActionsBlock>
        </Stack>
      </Stack>
    </Paper>
  );
};
