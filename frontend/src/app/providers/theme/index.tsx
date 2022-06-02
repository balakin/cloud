import { FC } from 'react';
import { GlobalStyles } from './global-styles';

export const withThemeConfig = (Component: FC) => () => {
  return (
    <>
      <GlobalStyles />
      <Component />
    </>
  );
};
