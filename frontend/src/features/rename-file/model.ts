import { ChangeFileDto, cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

type RenameData = {
  id: string;
  data: ChangeFileDto;
};

export const renameAction: FormAction<void, RenameData> = {
  mutation: async ({ id, data }) => {
    await cloudApi.files.changeFile(id, data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
