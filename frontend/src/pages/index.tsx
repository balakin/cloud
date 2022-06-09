import { Container } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from 'widgets/header';
import { PageContent } from 'widgets/page-content';
import { AccountPage } from './account';
import { AuthPage } from './auth';
import { Error404Page } from './error404';

export function Routing() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AuthPage />} />
      <Route path="/sign-up" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <>
            <Header />
            <PageContent>
              <Container>
                <Outlet />
              </Container>
            </PageContent>
          </>
        }
      >
        <Route path="account" element={<AccountPage />} />
        <Route path="404" element={<Error404Page />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
