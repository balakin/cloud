import { cloudApi, CreateFolderDto, FolderDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

export const createFolderAction: FormAction<FolderDto, CreateFolderDto> = {
  mutation: async (data) => {
    const response = await cloudApi.folders.createFolder(data);
    return response.data;
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
