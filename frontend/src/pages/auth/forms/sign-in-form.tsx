import { Button, Stack } from '@mui/material';
import { AuthByPasswordForm } from 'features/auth-by-password';
import { FC } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { url } from 'shared/helpers';

export const SignInForm: FC = () => {
  const navigate = useNavigate();
  const { redirectUrl } = useParams();
  const [searchParams] = useSearchParams();

  const handleSuccess = () => {
    if (redirectUrl && redirectUrl.startsWith('/')) {
      navigate(redirectUrl, { replace: true });
    } else {
      navigate('/account', { replace: true });
    }
  };

  return (
    <Stack spacing={2}>
      <AuthByPasswordForm onSuccess={handleSuccess} />
      <Button component={Link} variant="text" to={url('/sign-up', searchParams)}>
        Sign Up
      </Button>
    </Stack>
  );
};
