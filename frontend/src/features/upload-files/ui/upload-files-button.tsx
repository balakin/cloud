import { Button, ButtonTypeMap } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';
import { useUploadFiles } from '../context';

export type UploadFileButtonProps = ButtonTypeMap<{}, 'label'>['props'] & {
  folderId: string | null;
};

export const UploadFileButton: FC<UploadFileButtonProps> = ({ folderId, ...props }) => {
  const uploadFiles = useUploadFiles();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (files?.length !== 1) {
      return;
    }

    uploadFiles([files[0]], folderId);
    event.target.value = '';
  };

  return (
    <>
      <Button variant="outlined" size="small" component="label" {...props}>
        Upload file
        <input type="file" onChange={handleChange} hidden />
      </Button>
    </>
  );
};
