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

  const titleNode = (
    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
      {label}
    </Typography>
  );

  return (
    <Stack spacing={actions ? 0.25 : 0}>
      {actions ? (
        <Stack spacing={0.5} direction="row" alignItems="center">
          {titleNode}
          {actions}
        </Stack>
      ) : (
        titleNode
      )}
      {content}
    </Stack>
  );
};
