import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import { foldersConstants } from 'entities/folders';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { useDebounce } from 'shared/hooks/use-debounce';
import { Confirmation } from 'shared/ui/confirmation';
import { deleteAction } from '../model';

export type DeleteFileMenuItemProps = {
  id: string;
  name: string;
  onDelete?: () => void;
};

export const DeleteFileMenuItem: FC<DeleteFileMenuItemProps> = ({ id, name, onDelete }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleError = useSnackbarErrorHandler();
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useMutation(deleteAction.mutation, {
    onSuccess: () => {
      enqueueSnackbar('File deleted', { variant: 'success' });
      queryClient.invalidateQueries([foldersConstants.QUERY_KEY]);
      onDelete && onDelete();
    },
    onError: (error) => {
      const message = deleteAction.errorPayloadExtractor(error);
      handleError(message);
    },
  });
  const loading = useDebounce(deleteMutation.isLoading, 250);

  const handleClick = () => {
    setOpen(true);
  };

  const handleYes = () => {
    deleteMutation.mutate(id);
    setOpen(false);
  };

  const handleNo = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>{loading ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}</ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
      <Confirmation onYes={handleYes} onNo={handleNo} open={open}>
        <Typography>Are you sure you want to delete the "{name}" file?</Typography>
      </Confirmation>
    </>
  );
};
