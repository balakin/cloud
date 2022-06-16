import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuth } from './hooks';

export type AuthRole = 'anonymous' | 'user';

export type AuthGuardProps = PropsWithChildren<{
  role: AuthRole;
}>;

export const AuthGuard: FC<AuthGuardProps> = ({ children, role }) => {
  const viewerRole = useRole();
  const redirectUrl = useRedirectForRole(viewerRole);

  if (viewerRole === role) {
    return <>{children}</>;
  }

  return redirectUrl ? (
    <>
      <Navigate to={redirectUrl} replace />
    </>
  ) : null;
};

function useRole(): AuthRole {
  const isAuth = useIsAuth();

  return isAuth ? 'user' : 'anonymous';
}

function useRedirectForRole(role: AuthRole) {
  switch (role) {
    case 'anonymous':
      return `/sign-in?${new URLSearchParams({ redirect: window.location.pathname })}`;
    case 'user':
      return `/404`;
    default:
      return '';
  }
}
