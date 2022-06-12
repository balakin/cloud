import { alpha, Box, Container, Link as MuiLink, styled, Typography } from '@mui/material';
import { AuthGuard } from 'entities/viewer';
import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { UnitRoutesProvider } from 'shared/contexts/unit-routes-context';
import { createAnimationClassNames, url } from 'shared/helpers';
import classes from './animations.module.css';
import { SignInForm, SignUpForm } from './forms';
import { AuthRoutes } from './types';

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

const FormContainer = styled(Container)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

export type AuthPageProps = {
  usedRoutes: AuthRoutes;
};

export const AuthPage: FC<AuthPageProps> = ({ usedRoutes }) => {
  const location = useLocation();
  const isSignIn = location.pathname === '/sign-in';
  const { redirect } = useParams();
  const params = new URLSearchParams(redirect ? { redirect } : undefined);

  const unitRoutes: AuthRoutes = {
    ...usedRoutes,
    signIn: url(usedRoutes.signIn, params),
    signUp: url(usedRoutes.signUp, params),
  };

  return (
    <AuthGuard role="anonymous">
      <UnitRoutesProvider routes={unitRoutes}>
        <Root>
          <FormContainer maxWidth={false}>
            <SwitchTransition>
              <CSSTransition key={location.key} timeout={250} classNames={createAnimationClassNames('fade', classes)}>
                <FormCard>{isSignIn ? <SignInForm /> : <SignUpForm />}</FormCard>
              </CSSTransition>
            </SwitchTransition>
          </FormContainer>
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
      </UnitRoutesProvider>
    </AuthGuard>
  );
};
