import { Button, Stack } from '@mui/material';
import { AuthByPasswordForm } from 'features/auth-by-password';
import { FC } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUnitRoutes } from 'shared/contexts/unit-routes-context';
import { url } from 'shared/lib';
import { AuthRoutes } from '../types';

export const SignInForm: FC = () => {
  const navigate = useNavigate();
  const { redirectUrl } = useParams();
  const [searchParams] = useSearchParams();
  const routes = useUnitRoutes<AuthRoutes>();

  const handleSuccess = () => {
    if (redirectUrl && redirectUrl.startsWith('/')) {
      navigate(redirectUrl, { replace: true });
    } else {
      navigate(routes.storage, { replace: true });
    }
  };

  return (
    <Stack spacing={2}>
      <AuthByPasswordForm onSuccess={handleSuccess} />
      <Button component={Link} variant="text" to={url(routes.signUp, searchParams)}>
        Sign Up
      </Button>
    </Stack>
  );
};
