import { Button, ButtonTypeMap } from '@mui/material';
import { ChangeEventHandler, FC, useState } from 'react';
import { ACCEPT } from '../constants';
import { ChangeAvatarDialog } from './change-avatar-dialog';

export type ChangeAvatarButtonProps = ButtonTypeMap<{}, 'label'>['props'];

export const ChangeAvatarButton: FC<ChangeAvatarButtonProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (files?.length !== 1) {
      return;
    }

    setFile(files[0]);
    event.target.value = '';
  };

  const handleClose = () => {
    setFile(null);
  };

  return (
    <>
      <Button variant="contained" color="primary" component="label" {...props}>
        Change
        <input type="file" onChange={handleChange} accept={ACCEPT} hidden />
      </Button>
      {file && <ChangeAvatarDialog open={true} file={file} onClose={handleClose} />}
    </>
  );
};
