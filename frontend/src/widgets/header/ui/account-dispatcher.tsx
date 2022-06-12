import { Box, Button, Divider, Popover, Stack, styled, Typography } from '@mui/material';
import { ViewerAvatar, ViewerUserName } from 'entities/viewer';
import { useIsAuth } from 'entities/viewer/hooks';
import { LogoutButton } from 'features/logout';
import { FC, MouseEventHandler, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUnitRoutes } from 'shared/contexts/unit-routes-context';
import { HeaderRoutes } from '../types';

export type AccountDispatcherProps = {};

export const AccountDispatcher: FC<AccountDispatcherProps> = () => {
  const isAuth = useIsAuth();

  return isAuth ? <Authorized /> : <Unauthorized />;
};

const PopupContent = styled(Box)(() => ({
  minWidth: '250px',
  width: '100%',
}));

const TextLink = styled(Link)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  textDecoration: 'none',

  '&:hover, &:visited': {
    color: theme.palette.text.primary,
  },
}));

const Authorized: FC = () => {
  const routes = useUnitRoutes<HeaderRoutes>();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <ViewerAvatar onClick={handleClick} />
      <Popover
        sx={{ mt: 0.5 }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <PopupContent>
          <Stack sx={{ p: 1 }} direction="row" spacing={1} alignItems="center">
            <ViewerAvatar />
            {location.pathname === routes.account ? (
              <Typography variant="body1">
                <ViewerUserName />
              </Typography>
            ) : (
              <TextLink to={routes.account}>
                <ViewerUserName />
              </TextLink>
            )}
          </Stack>
          <Divider />
          <Box sx={{ p: 1 }}>
            <LogoutButton size="small" />
          </Box>
        </PopupContent>
      </Popover>
    </>
  );
};

const Unauthorized: FC = () => {
  const routes = useUnitRoutes<HeaderRoutes>();

  return (
    <Stack spacing={1} direction="row">
      <Button component={Link} to={routes.signIn}>
        Sign In
      </Button>
      <Button component={Link} to={routes.signUp}>
        Sign Up
      </Button>
    </Stack>
  );
};
