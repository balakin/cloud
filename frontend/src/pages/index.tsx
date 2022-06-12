import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from 'widgets/header';
import { AccountPage } from './account';
import { AuthPage } from './auth';
import { Error404Page } from './error404';
import { SettingsPage } from './settings';

export function Routing() {
  const auth = (
    <AuthPage
      usedRoutes={{
        signIn: '/sign-in',
        signUp: '/sign-up',
        account: '/account',
      }}
    />
  );

  return (
    <Routes>
      <Route path="/sign-in" element={auth} />
      <Route path="/sign-up" element={auth} />
      <Route
        path="/"
        element={
          <>
            <Header
              usedRoutes={{
                signIn: '/sign-in',
                signUp: '/sign-up',
                account: '/account',
                settings: '/settings',
              }}
            />
            <Outlet />
          </>
        }
      >
        <Route index element={<Navigate to="/404" replace />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="404" element={<Error404Page />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
