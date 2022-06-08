import { viewerModel } from 'entities/viewer';
import { cloudApi, SignInDto } from 'shared/api';

export async function signIn(dto: SignInDto) {
  await cloudApi.auth.signIn(dto);
  viewerModel.setAuthorized();
}
