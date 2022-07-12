import { FC, PropsWithChildren } from 'react';
import { DragAndDrop } from 'shared/ui/drag-and-drop';
import { useUploadFiles } from '../context';

export type UploadFilesDndProps = PropsWithChildren<{
  folderId: string | null;
}>;

export const UploadFilesDnd: FC<UploadFilesDndProps> = ({ folderId, children }) => {
  const uploadFiles = useUploadFiles();

  return (
    <DragAndDrop
      onDrop={(files) => {
        uploadFiles(files, folderId);
      }}
    >
      {children}
    </DragAndDrop>
  );
};
