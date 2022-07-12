import { UploadFilesProvider } from 'features/upload-files';
import { FC } from 'react';

export const withUploadFiles = (Component: FC) => () => {
  return (
    <UploadFilesProvider>
      <Component />
    </UploadFilesProvider>
  );
};
