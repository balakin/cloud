import { alpha, Avatar, styled } from '@mui/material';
import { grey } from '@mui/material/colors';
import { forwardRef, MouseEventHandler } from 'react';
import { cloudApi } from 'shared/api';
import { useViewer } from '../hooks';

const ClickableAvatar = styled(Avatar)({
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
      content: 'attr(data-text)',
      fontSize: '0.7em',
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
});

export type ViewerAvatarProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  width?: number;
  height?: number;
  text?: string;
};

export const ViewerAvatar = forwardRef<HTMLDivElement, ViewerAvatarProps>(({ onClick, width, height, text }, ref) => {
  const viewer = useViewer();

  if (!viewer) {
    return null;
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
      width: width ?? 36,
      height: height ?? 36,
    },
  };
}

function stringAvatar(name: string, width?: number, height?: number) {
  return {
    sx: {
      bgcolor: 'primary.main',
      width: width ?? 36,
      height: height ?? 36,
    },
    children: `${name[0].toUpperCase()}`,
  };
}
