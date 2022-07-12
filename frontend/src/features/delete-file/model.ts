import { cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action } from 'shared/types';

export const deleteAction: Action<void, string> = {
  mutation: async (id) => {
    await cloudApi.files.deleteFile(id);
  },
  errorPayloadExtractor: cloudHelpers.getErrorMessage,
};
