import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useViewer, ViewerAvatar, ViewerUserName } from 'entities/viewer';
import { FC } from 'react';

export type ViewerInfoProps = {};

export const ViewerInfo: FC<ViewerInfoProps> = () => {
  const viewer = useViewer();

  if (!viewer) {
    return <CircularProgress />;
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <ViewerAvatar width={80} height={80} />
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: '1em' }}>
            Username
          </Typography>
          <Typography variant="h5">
            <ViewerUserName />
          </Typography>
        </Box>
      </Stack>
    </>
  );
};
