import { FC, useMemo } from 'react';
import { getIcon } from '../icons';

export type FileIconProps = {
  name: string;
  fontSize?: string;
};

export const FileIcon: FC<FileIconProps> = ({ name, fontSize }) => {
  const { icon: Icon, color } = useMemo(() => getIcon(name), [name]);

  return <Icon sx={{ color, fontSize }} />;
};
