import { FC } from 'react';
import { useViewer } from './hooks';

export const ViewerUserName: FC = () => {
  const viewer = useViewer();

  return <>{viewer?.userName}</>;
};
