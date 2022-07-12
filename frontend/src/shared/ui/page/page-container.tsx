import { Container, ContainerProps, styled } from '@mui/material';
import { FC } from 'react';

const Root = styled(Container)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

export type PageContainerProps = ContainerProps;

export const PageContainer: FC<PageContainerProps> = (props) => {
  return <Root maxWidth={false} {...props} />;
};
