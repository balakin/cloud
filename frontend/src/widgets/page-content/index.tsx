import { styled } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const Root = styled('main')(() => ({
  flex: '1 0 auto',
  display: 'flex',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
}));

export type PageContentProps = PropsWithChildren<{}>;

export const PageContent: FC<PageContentProps> = ({ children }) => {
  return <Root>{children}</Root>;
};
