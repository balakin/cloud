import { Button, Stack } from '@mui/material';
import { RegistrationForm } from 'features/registration';
import { FC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUnitRoutes } from 'shared/contexts/unit-routes-context';
import { url } from 'shared/lib';
import { AuthRoutes } from '../types';

export const SignUpForm: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routes = useUnitRoutes<AuthRoutes>();

  const handleSuccess = () => {
    navigate(url(routes.signIn, searchParams), { replace: true });
  };

  return (
    <Stack spacing={2}>
      <RegistrationForm onSuccess={handleSuccess} />
      <Button component={Link} variant="text" to={url(routes.signIn, searchParams)}>
        Sign In
      </Button>
    </Stack>
  );
};
