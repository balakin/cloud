import { Box, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { withProviders } from './providers';

const Root = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const AppContent: FC = () => {
  return (
    <Root>
      <Typography variant="h1">Hello World!</Typography>
    </Root>
  );
};

export const App = withProviders(AppContent);
