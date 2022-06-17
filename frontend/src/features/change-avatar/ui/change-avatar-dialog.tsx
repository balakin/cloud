import ImageIcon from '@mui/icons-material/Image';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormHelperText,
  Slider,
  Stack,
  styled,
} from '@mui/material';
import { VIEWER_QUERY_KEY } from 'entities/viewer';
import { FC, MouseEventHandler, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useMutation, useQueryClient } from 'react-query';
import { ChangeAvatarDto } from 'shared/api';
import { useObjectUrl } from 'shared/hooks';
import { nameof } from 'shared/lib';
import { LoadingButton } from 'shared/ui/buttons';
import { ClosableDialogTitle } from 'shared/ui/dialog';
import { FormError } from 'shared/ui/form';
import { changeAvatarAction } from '../model';

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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const avatarSrc = useObjectUrl(file);
  const queryClient = useQueryClient();
  const changeAvatar = useMutation(changeAvatarAction.mutation, {
    onSuccess: (user) => {
      queryClient.setQueryData(VIEWER_QUERY_KEY, user);
      onClose && onClose();
    },
    onError: (error) => {
      const formError = changeAvatarAction.errorPayloadExtractor(error);
      setError(formError.message);
      setImageError(formError.fields[nameof<ChangeAvatarDto>('file')]);
    },
  });

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

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (file && croppedAreaPixels) {
      changeAvatar.mutate({ file, croppedAreaPixels });
    }
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <ClosableDialogTitle onClose={handleClose}>Edit avatar</ClosableDialogTitle>
      <DialogContent>
        {avatarSrc && (
          <Stack spacing={2}>
            <FormError error={error} />
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
            {imageError && <FormHelperText error={true}>{imageError}</FormHelperText>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingButton
          type="button"
          loading={changeAvatar.isLoading}
          onClick={handleClick}
          disabled={croppedAreaPixels === null}
        >
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
