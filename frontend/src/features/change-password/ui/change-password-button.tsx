import { Button, ButtonProps } from '@mui/material';
import { FC, useState } from 'react';
import { ChangePasswordDialog } from './change-password-dialog';

export type ChangePasswordButtonProps = Omit<ButtonProps, 'onClick'>;

export const ChangePasswordButton: FC<ChangePasswordButtonProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" {...props} onClick={handleClick}>
        Change
      </Button>
      <ChangePasswordDialog open={open} onClose={handleClose} />
    </>
  );
};
