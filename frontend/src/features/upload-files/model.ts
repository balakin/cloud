import { cloudApi, FileInfoDto, UploadFileDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

export const uploadFileAction: FormAction<FileInfoDto, UploadFileDto> = {
  mutation: async (data) => {
    const response = await cloudApi.files.uploadFile(data);
    return response.data;
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};

export const uploadFilesAction: FormAction<void, cloudApi.files.UploadFilesData> = {
  mutation: async (data) => {
    await cloudApi.files.uploadFiles(data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
