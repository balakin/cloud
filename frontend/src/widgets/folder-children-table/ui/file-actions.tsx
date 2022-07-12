import { IconButton, IconButtonProps, Menu } from '@mui/material';
import { FC, MouseEventHandler, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DeleteFileMenuItem } from 'features/delete-file';

export type FileActionsProps = {
  id: string;
  name: string;
} & Omit<IconButtonProps, 'onClick'>;

export const FileActions: FC<FileActionsProps> = ({ id, name, ...props }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" {...props} onClick={handleClick}>
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { maxWidth: '150px', width: '100%' } }}
        MenuListProps={{ dense: true }}
      >
        <DeleteFileMenuItem id={id} name={name} onDelete={handleClose} />
      </Menu>
    </>
  );
};
