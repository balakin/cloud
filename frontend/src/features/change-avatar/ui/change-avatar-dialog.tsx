import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Slider, Stack, styled } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import ImageIcon from '@mui/icons-material/Image';
import { useAction } from 'shared/hooks';
import { LoadingButton } from 'shared/ui/buttons';
import { changeAvatar } from '../model';
import { useViewerRefetch } from 'entities/viewer';

const CropperContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '250px',
  backgroundColor: theme.palette.grey[500],
}));

export type ChangeAvatarDialogProps = Omit<DialogProps, 'onClose'> & {
  onClose: () => void;
  file: File;
};

export const ChangeAvatarDialog: FC<ChangeAvatarDialogProps> = ({ onClose, file, ...props }) => {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const refetchViewer = useViewerRefetch();
  const { action, pending } = useAction(async () => {
    if (file && croppedAreaPixels) {
      await changeAvatar(file, croppedAreaPixels);
      await refetchViewer();
      onClose && onClose();
    }
  });

  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarSrc(url);

    return () => {
      URL.revokeObjectURL(url);
      setAvatarSrc(null);
    };
  }, [file]);

  const handleClose = () => {
    onClose && onClose();
  };

  const handleZoomChange = (_event: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      setZoom(value);
    }
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <DialogTitle>Edit avatar</DialogTitle>
      <DialogContent>
        {avatarSrc && (
          <Stack spacing={2}>
            <CropperContainer>
              <Cropper
                showGrid={false}
                cropShape="round"
                aspect={1}
                crop={crop}
                onCropChange={setCrop}
                image={avatarSrc}
                zoom={zoom}
                onCropComplete={handleCropComplete}
              />
            </CropperContainer>
            <Stack spacing={2} direction="row" alignItems="center">
              <ImageIcon fontSize="small" />
              <Slider min={1} max={2} step={0.01} aria-label="zoom" value={zoom} onChange={handleZoomChange} />
              <ImageIcon />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingButton type="button" loading={pending} onClick={action} disabled={croppedAreaPixels === null}>
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
