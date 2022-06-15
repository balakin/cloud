import { styled } from '@mui/system';
import { ViewerAvatar, ViewerAvatarProps } from 'entities/viewer';
import { ChangeEventHandler, forwardRef, useRef, useState } from 'react';
import { ACCEPT } from '../constants';
import { ChangeAvatarDialog } from './change-avatar-dialog';

const Root = styled('label')({
  position: 'relative',
  width: '80px',
  height: '80px',
});

const FileInput = styled('input')({
  position: 'absolute',
  pointerEvents: 'none',
});

export type AvatarSelectorProps = Omit<ViewerAvatarProps, 'text' | 'onClick'>;

export const AvatarSelector = forwardRef<HTMLDivElement, AvatarSelectorProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (files?.length !== 1) {
      return;
    }

    setFile(files[0]);
    event.target.value = '';
  };

  const handleClose = () => {
    setFile(null);
  };

  return (
    <Root>
      <ViewerAvatar width={80} height={80} ref={ref} {...props} text="change avatar" />
      <FileInput ref={inputRef} type="file" accept={ACCEPT} onChange={handleChange} hidden />
      {file && <ChangeAvatarDialog open={true} file={file} onClose={handleClose} />}
    </Root>
  );
});
