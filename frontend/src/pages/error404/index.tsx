import { Container, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { Helmet } from 'react-helmet';

const Root = styled(Container)(() => ({
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

export const Error404Page: FC = () => {
  return (
    <Root>
      <Helmet>
        <title>Not Found | Cloud</title>
      </Helmet>
      <Panel spacing={1}>
        <Typography variant="h4">404</Typography>
        <Typography variant="h5">Page Not Found</Typography>
      </Panel>
    </Root>
  );
};
