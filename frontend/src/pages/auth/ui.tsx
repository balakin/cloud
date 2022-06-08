import { alpha, Box, Link as MuiLink, styled, Typography } from '@mui/material';
import { AuthGuard } from 'entities/viewer';
import { useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { createAnimationClassNames } from 'shared/helpers';
import classes from './animations.module.css';
import { SignInForm, SignUpForm } from './forms';

const Root = styled(Box)(() => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  background: "url('/images/background.jpg') no-repeat center/cover",
}));

const FormCard = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(3),
  background: alpha(theme.palette.background.paper, 0.8),
  borderRadius: '25px',
}));

const Credits = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: '5px',
  color: theme.palette.text.secondary,
}));

export function AuthPage() {
  const location = useLocation();
  const isSignIn = location.pathname === '/sign-in';

  return (
    <AuthGuard role="anonymous">
      <Root>
        <SwitchTransition>
          <CSSTransition key={location.key} timeout={250} classNames={createAnimationClassNames('fade', classes)}>
            <FormCard>{isSignIn ? <SignInForm /> : <SignUpForm />}</FormCard>
          </CSSTransition>
        </SwitchTransition>
        <Credits variant="subtitle2">
          Photo by{' '}
          <MuiLink
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            href="https://unsplash.com/@asoggetti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >
            Alessio Soggetti
          </MuiLink>{' '}
          on Unsplash
        </Credits>
      </Root>
    </AuthGuard>
  );
}
