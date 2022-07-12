import { Button, Stack, styled, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { FC, PropsWithChildren } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Helmet } from 'react-helmet';
import { useQueryErrorResetBoundary } from 'react-query';
import { getErrorMessage } from 'shared/lib';
import { PageContainer } from './page-container';

const Root = styled('div')(() => ({
  flex: '1 1 auto',
  display: 'flex',
  overflow: 'hidden',
}));

export type PageProps = PropsWithChildren<{}>;

export const Page: FC<PageProps> = ({ children }) => {
  const { reset: handleReset } = useQueryErrorResetBoundary();

  return (
    <Root>
      <ErrorBoundary FallbackComponent={Fallback} onReset={handleReset}>
        {children}
      </ErrorBoundary>
    </Root>
  );
};

const ErrorRoot = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ErrorPanel = styled(Stack)({
  display: 'flex',
  maxWidth: '500px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

export const Fallback: FC<FallbackProps> = ({ resetErrorBoundary, error }) => {
  const isNotFoundError = error instanceof AxiosError && error.response && error.response.status === 404;

  const handleClick = () => {
    resetErrorBoundary();
  };

  return (
    <>
      <Helmet>
        <title>Error | Cloud</title>
      </Helmet>
      <PageContainer>
        <ErrorRoot>
          <ErrorPanel spacing={2}>
            <Typography variant="h5">Error</Typography>
            <Typography>{getErrorMessage(error)}</Typography>
            {isNotFoundError ? null : (
              <Button variant="contained" color="primary" size="small" onClick={handleClick}>
                Try Again
              </Button>
            )}
          </ErrorPanel>
        </ErrorRoot>
      </PageContainer>
    </>
  );
};
