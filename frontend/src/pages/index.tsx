import { Container } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from 'widgets/header';
import { PageContent } from 'widgets/page-content';
import { AccountPage } from './account';
import { AuthPage } from './auth';
import { Error404Page } from './error404';

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
              }}
            />
            <PageContent>
              <Container maxWidth={false}>
                <Outlet />
              </Container>
            </PageContent>
          </>
        }
      >
        <Route index element={<Navigate to="/404" replace />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="404" element={<Error404Page />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
