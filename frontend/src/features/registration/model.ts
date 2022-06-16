import { cloudApi, SignUpDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action, FormError } from 'shared/types';

export const signUpAction: Action<SignUpDto, FormError> = {
  execute: async (data: SignUpDto) => {
    await cloudApi.auth.signUp(data);
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
