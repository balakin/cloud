import { Routing } from 'pages';
import { FC } from 'react';
import { withProviders } from './providers';

const AppContent: FC = () => {
  return <Routing />;
};

export const App = withProviders(AppContent);
