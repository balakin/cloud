import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ViewerAvatar, ViewerUserName } from 'entities/viewer';
import { useIsAuth } from 'entities/viewer/hooks';
import { LogoutButton } from 'features/logout';
import { FC, MouseEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
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

const Authorized: FC = () => {
  const routes = useUnitRoutes<HeaderRoutes>();
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
            <Typography variant="body1">
              <ViewerUserName />
            </Typography>
          </Stack>
          <Divider />
          <nav>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.account}>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
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
