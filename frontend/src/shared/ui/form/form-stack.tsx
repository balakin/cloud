import { Stack, StackProps } from '@mui/material';
import { FC } from 'react';

export type FormStackProps = StackProps;

export const FormStack: FC<FormStackProps> = (props) => {
  return <Stack spacing={2} {...props} />;
};
