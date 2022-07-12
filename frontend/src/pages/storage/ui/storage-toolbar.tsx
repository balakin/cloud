import { Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export type StorageToolbarProps = PropsWithChildren<{}>;

export const StorageToolbar: FC<StorageToolbarProps> = ({ children }) => {
  return (
    <Stack spacing={2} direction="row">
      {children}
    </Stack>
  );
};
