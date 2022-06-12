import { IconButton, IconButtonProps } from '@mui/material';
import { FC, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ChangePasswordDialog } from './change-password-dialog';

export type ChangePasswordIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
  iconSize?: string;
};

export const ChangePasswordIconButton: FC<ChangePasswordIconButtonProps> = ({ iconSize, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton size="small" {...props} onClick={handleClick}>
        <EditIcon sx={{ fontSize: iconSize }} />
      </IconButton>
      <ChangePasswordDialog open={open} onClose={handleClose} />
    </>
  );
};
