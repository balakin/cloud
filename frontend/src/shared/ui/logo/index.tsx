import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

export const Logo: FC = () => {
  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <FilterDramaIcon fontSize="medium" />{' '}
      <Typography variant="h1" sx={{ fontSize: '1.5rem' }}>
        Cloud
      </Typography>
    </Stack>
  );
};
