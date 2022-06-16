import { ChangePasswordDto, cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action, FormError } from 'shared/types';

export const changePasswordAction: Action<ChangePasswordDto, FormError> = {
  execute: async (data: ChangePasswordDto) => {
    await cloudApi.auth.changePassword(data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
