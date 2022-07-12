import { Button, ButtonProps } from '@mui/material';
import { FC, useState } from 'react';
import { CreateFolderDialog } from './create-folder-dialog';

export type CreateFolderButtonProps = Omit<ButtonProps, 'onClick'> & {
  parentId: string | null;
};

export const CreateFolderButton: FC<CreateFolderButtonProps> = ({ parentId, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" size="small" {...props} onClick={handleClick}>
        Create folder
      </Button>
      <CreateFolderDialog parentId={parentId} open={open} onClose={handleClose} />
    </>
  );
};
