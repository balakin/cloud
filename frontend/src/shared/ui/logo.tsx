import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

export const Logo: FC = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <FilterDramaIcon fontSize="large" />{' '}
      <Typography variant="h1" sx={{ fontSize: '32px' }}>
        Cloud
      </Typography>
    </Stack>
  );
};
