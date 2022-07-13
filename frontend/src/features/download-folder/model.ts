import { cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action } from 'shared/types';

export const downloadAction: Action<void, string> = {
  mutation: async (id) => {
    cloudApi.folders.downloadFolder(id);
  },
  errorPayloadExtractor: cloudHelpers.getErrorMessage,
};
