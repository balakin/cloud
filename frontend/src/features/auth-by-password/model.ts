import { viewerModel } from 'entities/viewer';
import { cloudApi, SignInDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { Action, FormError } from 'shared/types';

export const signInAction: Action<SignInDto, FormError> = {
  execute: async (data: SignInDto) => {
    await cloudApi.auth.signIn(data);
    viewerModel.setAuthorized();
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
