import { ChangeFolderDto, cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

type RenameData = {
  id: string;
  data: ChangeFolderDto;
};

export const renameAction: FormAction<void, RenameData> = {
  mutation: async ({ id, data }) => {
    await cloudApi.folders.changeFolder(id, data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
