import { cloudApi, SignUpDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

export const signUpAction: FormAction<void, SignUpDto> = {
  mutation: async (data) => {
    await cloudApi.auth.signUp(data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
