import { FC, MouseEventHandler } from 'react';
import { useAction } from 'shared/hooks';
import { LoadingButton, LoadingButtonProps } from 'shared/ui/buttons';
import { logout } from './model';

export type LogoutButtonProps = Omit<LoadingButtonProps, 'onClick' | 'loading'>;

export const LogoutButton: FC<LogoutButtonProps> = (props) => {
  const { action, pending } = useAction(logout);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    action();
  };

  return (
    <LoadingButton onClick={handleClick} loading={pending} {...props}>
      Logout
    </LoadingButton>
  );
};
