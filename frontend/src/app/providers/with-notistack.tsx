import { SnackbarProvider } from 'notistack';
import { FC } from 'react';

export const withNotistack = (Component: FC) => () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Component />
    </SnackbarProvider>
  );
};
