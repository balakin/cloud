import { CircularProgress, Stack, Typography } from '@mui/material';
import { useViewer, ViewerAvatar, ViewerUserName } from 'entities/viewer';
import { FC } from 'react';
import { InfoBlock } from 'shared/ui/blocks';

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
        <InfoBlock label="Username">
          <Typography variant="h6">
            <ViewerUserName />
          </Typography>
        </InfoBlock>
      </Stack>
    </>
  );
};
