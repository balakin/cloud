import { ButtonProps } from '@mui/material';
import { useViewerRefetch } from 'entities/viewer';
import { FC } from 'react';
import { useAction } from 'shared/hooks';
import { LoadingButton } from 'shared/ui/buttons';
import { deleteAvatar } from '../model';

export type DeleteAvatarButtonProps = Omit<ButtonProps, 'onClick'>;

export const DeleteAvatarButton: FC<DeleteAvatarButtonProps> = (props) => {
  const { action, pending } = useAction(deleteAvatar);
  const refetchViewer = useViewerRefetch();

  const handleClick = () => {
    (async () => {
      await action();
      await refetchViewer();
    })();
  };

  return (
    <LoadingButton {...props} loading={pending} onClick={handleClick}>
      Delete
    </LoadingButton>
  );
};
