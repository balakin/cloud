import { FC, MouseEventHandler } from 'react';
import { useMutation } from 'react-query';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { LoadingButton, LoadingButtonProps } from 'shared/ui/buttons';
import { logoutAction } from './model';

export type LogoutButtonProps = Omit<LoadingButtonProps, 'onClick' | 'loading'>;

export const LogoutButton: FC<LogoutButtonProps> = (props) => {
  const handleError = useSnackbarErrorHandler();
  const logout = useMutation(logoutAction.mutation, {
    onError: (error) => {
      const message = logoutAction.errorPayloadExtractor(error);
      handleError(message);
    },
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    logout.mutate();
  };

  return (
    <LoadingButton onClick={handleClick} loading={logout.isLoading} {...props}>
      Logout
    </LoadingButton>
  );
};
