import { cloudApi, User } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action } from 'shared/types';

export const deleteAvatarAction: Action<User, void> = {
  mutation: async () => {
    const response = await cloudApi.user.deleteAvatar();
    return response.data;
  },
  errorPayloadExtractor: cloudHelpers.getErrorMessage,
};
