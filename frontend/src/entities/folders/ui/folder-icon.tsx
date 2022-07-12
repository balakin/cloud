import { FC, useMemo } from 'react';
import { getIcon } from '../icons';

export type FolderIconProps = {
  name: string;
  fontSize?: string;
};

export const FolderIcon: FC<FolderIconProps> = ({ name, fontSize }) => {
  const { icon: Icon, color } = useMemo(() => getIcon(name), [name]);

  return <Icon sx={{ color, fontSize }} />;
};
