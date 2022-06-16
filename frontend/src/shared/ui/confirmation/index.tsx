import { Button, Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { FC } from 'react';
import { ClosableDialogTitle } from '../dialog';

export type ConfirmationProps = Omit<DialogProps, 'onClose'> & {
  onYes: () => void;
  onNo: () => void;
  title?: string;
};

export const Confirmation: FC<ConfirmationProps> = ({ onYes, onNo, title, children, ...props }) => {
  const handleNo = () => {
    onNo();
  };

  const handleYes = () => {
    onYes();
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleNo}>
      <ClosableDialogTitle onClose={handleNo}>{title ?? 'Confirmation'}</ClosableDialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleNo}>No</Button>
        <Button onClick={handleYes}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};
