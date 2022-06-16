import { Area } from 'react-easy-crop';
import { cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action, FormError } from 'shared/types';

export type ChangeAvatarArg = {
  file: File;
  croppedAreaPixels: Area;
};

export const changeAvatarAction: Action<ChangeAvatarArg, FormError> = {
  execute: async (arg: ChangeAvatarArg) => {
    await changeAvatar(arg.file, arg.croppedAreaPixels);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};

async function changeAvatar(file: File, croppedAreaPixels: Area) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) {
    canvas.remove();
    throw new Error('Unsupported');
  }

  try {
    const image = await createImageFromFile(file);
    try {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      context.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob === null) {
            reject(new Error('Image crop error'));
            return;
          }

          resolve(blob);
        }, file.type);
      });

      const croppedFile = new File([blob], file.name, {
        lastModified: file.lastModified,
        type: file.type,
      });

      await cloudApi.user.changeAvatar({ file: croppedFile });
    } catch (error) {
      throw error;
    } finally {
      image.remove();
    }
  } catch (error) {
    throw error;
  } finally {
    canvas.remove();
  }
}

async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const image = document.createElement('img');
  image.src = url;

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);

  return await new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error('Image load error'));
    };
  });
}
