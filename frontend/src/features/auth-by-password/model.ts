import { viewerModel } from 'entities/viewer';
import { cloudApi, SignInDto } from 'shared/api';
import { cloudHelpers } from 'shared/helpers';
import { FormAction } from 'shared/types';

export const signInAction: FormAction<void, SignInDto> = {
  mutation: async (data) => {
    await cloudApi.auth.signIn(data);
    viewerModel.setAuthorized();
  },
  errorPayloadExtractor: cloudHelpers.getFormError,
};
