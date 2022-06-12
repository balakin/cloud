import { Container, ContainerProps, styled } from '@mui/material';
import { FC } from 'react';

const Root = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export type PageContainerProps = ContainerProps;

export const PageContainer: FC<PageContainerProps> = (props) => {
  return <Root maxWidth={false} {...props} />;
};
