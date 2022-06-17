import { ButtonProps, Typography } from '@mui/material';
import { VIEWER_QUERY_KEY } from 'entities/viewer';
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { LoadingButton } from 'shared/ui/buttons';
import { Confirmation } from 'shared/ui/confirmation';
import { deleteAvatarAction } from '../model';

export type DeleteAvatarButtonProps = Omit<ButtonProps, 'onClick'>;

export const DeleteAvatarButton: FC<DeleteAvatarButtonProps> = (props) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const handleError = useSnackbarErrorHandler();
  const queryClient = useQueryClient();
  const deleteAvatar = useMutation(deleteAvatarAction.mutation, {
    onSuccess: (user) => {
      queryClient.setQueryData(VIEWER_QUERY_KEY, user);
    },
    onError: (error) => {
      const message = deleteAvatarAction.errorPayloadExtractor(error);
      handleError(message);
    },
  });

  const handleClick = () => {
    setConfirmationOpen(true);
  };

  const handleYes = () => {
    setConfirmationOpen(false);
    deleteAvatar.mutate();
  };

  const handleNo = () => {
    setConfirmationOpen(false);
  };

  return (
    <>
      <LoadingButton {...props} loading={deleteAvatar.isLoading} onClick={handleClick}>
        Delete
      </LoadingButton>
      <Confirmation title="Delete" open={confirmationOpen} onYes={handleYes} onNo={handleNo}>
        <Typography>Are you sure you want to remove the avatar?</Typography>
        <Typography>This action can't be undone.</Typography>
      </Confirmation>
    </>
  );
};
