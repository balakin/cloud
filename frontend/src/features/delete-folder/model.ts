import { cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action } from 'shared/types';

export const deleteAction: Action<void, string> = {
  mutation: async (id) => {
    await cloudApi.folders.deleteFolder(id);
  },
  errorPayloadExtractor: cloudHelpers.getErrorMessage,
};
