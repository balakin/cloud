import { Alert, AlertProps, styled } from '@mui/material';
import { FC } from 'react';

const ErrorAlert = styled(Alert)(() => ({
  whiteSpace: 'break-spaces',
  wordBreak: 'break-word',
}));

export type FormErrorProps = {
  error: string | null;
} & AlertProps;

export const FormError: FC<FormErrorProps> = ({ error, ...props }) => {
  if (!error) {
    return null;
  }

  return (
    <ErrorAlert severity="error" {...props}>
      {error}
    </ErrorAlert>
  );
};
