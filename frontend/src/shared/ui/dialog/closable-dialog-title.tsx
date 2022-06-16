import CloseIcon from '@mui/icons-material/Close';
import { Box, BoxProps, DialogTitle, IconButton } from '@mui/material';
import { FC, MouseEventHandler } from 'react';

export type ClosableDialogTitleProps = BoxProps & {
  onClose: () => void;
};

export const ClosableDialogTitle: FC<ClosableDialogTitleProps> = ({ onClose, ...props }) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  return (
    <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
      <Box {...props} />
      <IconButton onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};
