import { ViewerProvider } from 'entities/viewer';
import { FC } from 'react';

export const withViewer = (Component: FC) => () => {
  return (
    <ViewerProvider>
      <Component />
    </ViewerProvider>
  );
};
