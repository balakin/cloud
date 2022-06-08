import { Navigate, Route, Routes } from 'react-router-dom';
import { AccountPage } from './account';
import { Error404Page } from './error404';
import { AuthPage } from './auth';

export function Routing() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AuthPage />} />
      <Route path="/sign-up" element={<AuthPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/404" element={<Error404Page />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
