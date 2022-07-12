import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FC, useState } from 'react';
import { RenameFileDialog } from './rename-file-dialog';

export type RenameFileMenuItemProps = {
  id: string;
  name: string;
  onClose?: () => void;
};

export const RenameFileMenuItem: FC<RenameFileMenuItemProps> = ({ id, name, onClose }) => {
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
      {open && <RenameFileDialog open={true} id={id} name={name} onClose={handleClose} />}
    </>
  );
};
