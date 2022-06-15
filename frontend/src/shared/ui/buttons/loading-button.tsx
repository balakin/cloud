// eslint-disable-next-line no-restricted-imports
import { LoadingButton as MuiLoadingButton } from '@mui/lab';
import { ButtonProps } from '@mui/material';
import { FC } from 'react';

// TODO: Remove temp fix (https://github.com/mui/material-ui/issues/30038)

export type LoadingButtonProps = {
  loading?: boolean;
} & ButtonProps;

export const LoadingButton: FC<LoadingButtonProps> = (props) => {
  return <MuiLoadingButton {...props} />;
};
