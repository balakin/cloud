import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from 'widgets/header';
import { AuthPage } from './auth';
import { Error404Page } from './error404';
import { SettingsPage } from './settings';
import { StoragePage } from './storage';

export function Routing() {
  const auth = (
    <AuthPage
      usedRoutes={{
        signIn: '/sign-in',
        signUp: '/sign-up',
        storage: '/?id=root',
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
                settings: '/settings',
                storage: '/?id=root',
              }}
            />
            <Outlet />
          </>
        }
      >
        <Route
          index
          element={
            <StoragePage
              usedRoutes={{
                folder: (id) => `/?id=${id}`,
                root: '/?id=root',
              }}
            />
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="404" element={<Error404Page />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
