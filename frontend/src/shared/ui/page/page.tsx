import { styled } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const Root = styled('div')(() => ({
  flex: '1 0 auto',
  display: 'flex',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
}));

export type PageProps = PropsWithChildren<{}>;

export const Page: FC<PageProps> = ({ children }) => {
  return <Root>{children}</Root>;
};
