import { Skeleton } from '@mui/material';
import { FC } from 'react';
import { useViewer } from '../hooks';

export const ViewerUserName: FC = () => {
  const viewer = useViewer();

  if (viewer) {
    return <>{viewer?.userName}</>;
  }

  return (
    <>
      <Skeleton width={100} />
    </>
  );
};
