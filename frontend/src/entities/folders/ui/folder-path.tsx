import { Breadcrumbs, Skeleton, Typography, Link as MuiLink } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useFolderPath } from '../hooks';

export type FolderPathProps = {
  id: string;
  folderRoute: (id: string) => string;
  rootRoute: string;
};

export const FolderPath: FC<FolderPathProps> = ({ id, folderRoute, rootRoute }) => {
  const { data, isLoading } = useFolderPath(id);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {data && !isLoading ? (
        [
          <MuiLink component={Link} underline="none" color="inherit" to={rootRoute} key={id}>
            Cloud
          </MuiLink>,
          ...data.parts.map(({ name, id }, index) =>
            index + 1 === data.parts.length ? (
              <Typography color="text.primary" key={id}>
                {name}
              </Typography>
            ) : (
              <MuiLink component={Link} underline="none" color="inherit" to={folderRoute(id)} key={id}>
                {name}
              </MuiLink>
            )
          ),
        ]
      ) : (
        <Skeleton width={150} />
      )}
    </Breadcrumbs>
  );
};
