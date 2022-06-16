import { ButtonProps } from '@mui/material';
import { useViewerRefetch } from 'entities/viewer';
import { FC, useEffect } from 'react';
import { useAction, useSnackbarErrorHandler } from 'shared/hooks';
import { LoadingButton } from 'shared/ui/buttons';
import { deleteAvatarAction } from '../model';

export type DeleteAvatarButtonProps = Omit<ButtonProps, 'onClick'>;

export const DeleteAvatarButton: FC<DeleteAvatarButtonProps> = (props) => {
  const deleteAvatar = useAction(deleteAvatarAction);
  const refetchViewer = useViewerRefetch();
  const handleError = useSnackbarErrorHandler();

  useEffect(() => {
    if (deleteAvatar.isError) {
      handleError(deleteAvatar.errorPayload);
    }
  }, [handleError, deleteAvatar.isError, deleteAvatar.errorPayload]);

  const handleClick = () => {
    (async () => {
      await deleteAvatar.execute();
      refetchViewer();
    })();
  };

  return (
    <LoadingButton {...props} loading={deleteAvatar.isPending} onClick={handleClick}>
      Delete
    </LoadingButton>
  );
};
