import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FC } from 'react';
import { useMutation } from 'react-query';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { downloadAction } from '../model';

export type DownloadFileMenuItemProps = {
  id: string;
  onDownload?: () => void;
};

export const DownloadFileMenuItem: FC<DownloadFileMenuItemProps> = ({ id, onDownload }) => {
  const handleError = useSnackbarErrorHandler();
  const download = useMutation(downloadAction.mutation, {
    onSuccess: () => {
      onDownload && onDownload();
    },
    onError: (error) => {
      const message = downloadAction.errorPayloadExtractor(error);
      handleError(message);
    },
  });

  const handleClick = () => {
    download.mutate(id);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <FileDownloadIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Download</ListItemText>
    </MenuItem>
  );
};
