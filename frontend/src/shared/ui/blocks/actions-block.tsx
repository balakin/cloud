import { Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export type ActionsBlockProps = PropsWithChildren<{ label: string }>;

export const ActionsBlock: FC<ActionsBlockProps> = ({ label, children }) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Stack spacing={1} direction="row">
        {children}
      </Stack>
    </Stack>
  );
};
