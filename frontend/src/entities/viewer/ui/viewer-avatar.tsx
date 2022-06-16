import { alpha, Avatar, Skeleton, styled } from '@mui/material';
import { grey } from '@mui/material/colors';
import { forwardRef, MouseEventHandler } from 'react';
import { cloudApi } from 'shared/api';
import { useViewer } from '../hooks';

const DEFAULT_WIDTH = 36;
const DEFAULT_HEIGHT = 36;

const ClickableAvatar = styled(Avatar)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',

  '&:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#00000000',
  },

  '&:hover': {
    cursor: 'pointer',

    '&:after': {
      ...theme.typography.body2,
      content: 'attr(data-text)',
      fontSize: '0.8em',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: alpha(grey[700], 0.6),
      color: 'white',
    },
  },
}));

const ClickableSkeleton = styled(Skeleton)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',

  '&:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#00000000',
  },

  '&:hover': {
    cursor: 'pointer',

    '&:after': {
      ...theme.typography.body2,
      content: 'attr(data-text)',
      fontSize: '0.8em',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: alpha(grey[700], 0.6),
      color: 'white',
    },
  },
}));

export type ViewerAvatarProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  width?: number;
  height?: number;
  text?: string;
};

export const ViewerAvatar = forwardRef<HTMLDivElement, ViewerAvatarProps>(({ onClick, width, height, text }, ref) => {
  const viewer = useViewer();

  if (!viewer) {
    if (onClick || text) {
      return (
        <ClickableSkeleton
          variant="circular"
          width={width ?? DEFAULT_WIDTH}
          height={height ?? DEFAULT_HEIGHT}
          onClick={onClick}
          data-text={text}
        />
      );
    }

    return <Skeleton variant="circular" width={width ?? DEFAULT_WIDTH} height={height ?? DEFAULT_HEIGHT} />;
  }

  const avatarUrl = viewer.avatarId ? cloudApi.files.getFileUrl(viewer.avatarId) : undefined;

  if (onClick || text) {
    return (
      <ClickableAvatar
        ref={ref}
        onClick={onClick}
        {...(avatarUrl ? imageAvatar(width, height) : stringAvatar(viewer.userName, width, height))}
        src={avatarUrl}
        data-text={text}
      />
    );
  }

  return (
    <Avatar
      ref={ref}
      {...(avatarUrl ? imageAvatar(width, height) : stringAvatar(viewer.userName, width, height))}
      src={avatarUrl}
    />
  );
});

function imageAvatar(width?: number, height?: number) {
  return {
    sx: {
      width: width ?? DEFAULT_WIDTH,
      height: height ?? DEFAULT_HEIGHT,
    },
  };
}

function stringAvatar(name: string, width?: number, height?: number) {
  return {
    sx: {
      bgcolor: 'primary.main',
      width: width ?? DEFAULT_WIDTH,
      height: height ?? DEFAULT_HEIGHT,
    },
    children: `${name[0].toUpperCase()}`,
  };
}
