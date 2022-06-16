import { cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action } from 'shared/types';

export const deleteAvatarAction: Action<void, string> = {
  execute: async () => {
    await cloudApi.user.deleteAvatar();
  },
  errorPayloadExtractor: cloudHelpers.getErrorMessage,
};
