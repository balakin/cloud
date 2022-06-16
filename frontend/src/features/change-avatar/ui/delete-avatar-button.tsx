import { ButtonProps, Typography } from '@mui/material';
import { useViewerRefetch } from 'entities/viewer';
import { FC, useEffect, useState } from 'react';
import { useAction, useSnackbarErrorHandler } from 'shared/hooks';
import { LoadingButton } from 'shared/ui/buttons';
import { Confirmation } from 'shared/ui/confirmation';
import { deleteAvatarAction } from '../model';

export type DeleteAvatarButtonProps = Omit<ButtonProps, 'onClick'>;

export const DeleteAvatarButton: FC<DeleteAvatarButtonProps> = (props) => {
  const deleteAvatar = useAction(deleteAvatarAction);
  const refetchViewer = useViewerRefetch();
  const handleError = useSnackbarErrorHandler();
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    if (deleteAvatar.isError) {
      handleError(deleteAvatar.errorPayload);
    }
  }, [handleError, deleteAvatar.isError, deleteAvatar.errorPayload]);

  const handleClick = () => {
    setConfirmationOpen(true);
  };

  const handleYes = () => {
    setConfirmationOpen(false);
    (async () => {
      await deleteAvatar.execute();
      refetchViewer();
    })();
  };

  const handleNo = () => {
    setConfirmationOpen(false);
  };

  return (
    <>
      <LoadingButton {...props} loading={deleteAvatar.isPending} onClick={handleClick}>
        Delete
      </LoadingButton>
      <Confirmation title="Delete" open={confirmationOpen} onYes={handleYes} onNo={handleNo}>
        <Typography>Are you sure you want to remove the avatar?</Typography>
        <Typography>This action can't be undone.</Typography>
      </Confirmation>
    </>
  );
};
