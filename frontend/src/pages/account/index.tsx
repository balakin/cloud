import { Box, CircularProgress, Stack, styled, Typography } from '@mui/material';
import { AuthGuard, useViewer, ViewerUserName } from 'entities/viewer';
import { LogoutButton } from 'features/logout';
import { FC } from 'react';

const Root = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Panel = styled(Stack)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '450px',
  width: '100%',
}));

export const AccountPage: FC = () => {
  const viewer = useViewer();

  return (
    <AuthGuard role="user">
      <Root>
        <Panel spacing={3}>
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
        </Panel>
      </Root>
    </AuthGuard>
  );
};
