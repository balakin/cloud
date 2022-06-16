import { FC, MouseEventHandler, useEffect } from 'react';
import { useAction, useSnackbarErrorHandler } from 'shared/hooks';
import { LoadingButton, LoadingButtonProps } from 'shared/ui/buttons';
import { logoutAction } from './model';

export type LogoutButtonProps = Omit<LoadingButtonProps, 'onClick' | 'loading'>;

export const LogoutButton: FC<LogoutButtonProps> = (props) => {
  const logout = useAction(logoutAction);
  const handleError = useSnackbarErrorHandler();

  useEffect(() => {
    if (logout.isError) {
      handleError(logout.errorPayload);
    }
  }, [handleError, logout.isError, logout.errorPayload]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    logout.execute();
  };

  return (
    <LoadingButton onClick={handleClick} loading={logout.isPending} {...props}>
      Logout
    </LoadingButton>
  );
};
