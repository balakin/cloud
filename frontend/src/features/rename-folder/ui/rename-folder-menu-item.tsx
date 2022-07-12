import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FC, useState } from 'react';
import { RenameFolderDialog } from './rename-folder-dialog';

export type RenameFolderMenuItemProps = {
  id: string;
  name: string;
  onClose?: () => void;
};

export const RenameFolderMenuItem: FC<RenameFolderMenuItemProps> = ({ id, name, onClose }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>
      {open && <RenameFolderDialog open={true} id={id} name={name} onClose={handleClose} />}
    </>
  );
};
