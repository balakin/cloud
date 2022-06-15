import { Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

export type InfoBlockProps = PropsWithChildren<{
  label: string;
  actions?: ReactNode;
  value?: string;
}>;

export const InfoBlock: FC<InfoBlockProps> = ({ label, actions, children, value }) => {
  let content = value ? value : children;
  if (typeof content === 'string') {
    content = <Typography>{content}</Typography>;
  }

  return (
    <Stack>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      {content}
    </Stack>
  );
};
