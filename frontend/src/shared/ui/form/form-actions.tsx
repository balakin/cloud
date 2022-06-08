import { Stack, StackProps } from '@mui/material';
import { FC } from 'react';

export type FormActionsProps = StackProps;

export const FormActions: FC<FormActionsProps> = (props) => {
  return <Stack spacing={2} direction="row" {...props} />;
};
