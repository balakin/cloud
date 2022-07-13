import { useViewer } from 'entities/viewer';
import { UploadFilesProvider } from 'features/upload-files';
import { FC } from 'react';

export const withUploadFiles = (Component: FC) => () => {
  const viewer = useViewer();

  if (viewer === null) {
    return <Component />;
  }

  return (
    <UploadFilesProvider>
      <Component />
    </UploadFilesProvider>
  );
};
