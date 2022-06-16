import { Button, Stack } from '@mui/material';
import { RegistrationForm } from 'features/registration';
import { FC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { url } from 'shared/lib';

export const SignUpForm: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSuccess = () => {
    navigate(url('/sign-in', searchParams), { replace: true });
  };

  return (
    <Stack spacing={2}>
      <RegistrationForm onSuccess={handleSuccess} />
      <Button component={Link} variant="text" to={url('/sign-in', searchParams)}>
        Sign In
      </Button>
    </Stack>
  );
};
