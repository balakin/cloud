import { Container, styled } from '@mui/material';
import { FC } from 'react';
import { Logo } from 'shared/ui/logo';
import { HEIGHT } from './constants';

const Root = styled('header')(({ theme }) => ({
  height: HEIGHT,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  flex: `0 0 ${HEIGHT}`,
}));

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  return (
    <Root>
      <Container maxWidth={false}>
        <Logo />
      </Container>
    </Root>
  );
};
