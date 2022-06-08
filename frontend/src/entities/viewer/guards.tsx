import { FC, PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ViewerContext } from './contexts';
import { useIsAuth } from './hooks';

export type AuthRole = 'anonymous' | 'user';

export type AuthGuardProps = PropsWithChildren<{
  role: AuthRole;
}>;

export const AuthGuard: FC<AuthGuardProps> = ({ children, role }) => {
  const context = useContext(ViewerContext);
  const viewerRole = useRole();
  const redirectUrl = useRedirectForRole(viewerRole);

  if (viewerRole === role) {
    if (role !== 'user' || (role === 'user' && context?.viewer)) {
      return <>{children}</>;
    } else {
      // the user is loading or a fetch error has occurred
      return null;
    }
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
