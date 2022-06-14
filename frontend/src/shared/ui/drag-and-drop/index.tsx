import { Box, BoxProps, styled } from '@mui/material';
import { FC, useCallback, useEffect, useRef } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

type RootProps = BoxProps & { dragging: boolean };

const Root = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'dragging',
})<RootProps>(({ dragging, theme }) => ({
  position: 'relative',
  border: dragging ? `1px dashed ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0)',
  display: 'flex',
}));

export type DragAndDropProps = Omit<BoxProps, 'onDrop'> & {
  onDrop?: DropzoneOptions['onDrop'];
};

export const DragAndDrop: FC<DragAndDropProps> = ({ onDrop, ...props }) => {
  const onDropRef = useRef<DropzoneOptions['onDrop'] | null>(onDrop ?? null);
  const handleDrop = useCallback<Exclude<DropzoneOptions['onDrop'], undefined>>((...args) => {
    onDropRef.current && onDropRef.current(...args);
  }, []);
  const { isDragActive, getRootProps } = useDropzone({ onDrop: handleDrop, noDragEventsBubbling: true, noClick: true });

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  return <Root {...props} {...getRootProps()} dragging={isDragActive} />;
};
