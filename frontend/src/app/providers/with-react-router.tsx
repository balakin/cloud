import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withReactRouter = (Component: FC) => () => {
  return (
    <BrowserRouter>
      <Component />
    </BrowserRouter>
  );
};
