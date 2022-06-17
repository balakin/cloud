import { ChangePasswordDto, cloudApi } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

export const changePasswordAction: FormAction<void, ChangePasswordDto> = {
  mutation: async (data) => {
    await cloudApi.auth.changePassword(data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
