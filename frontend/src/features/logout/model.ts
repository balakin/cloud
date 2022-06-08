import { viewerModel } from 'entities/viewer';
import { cloudApi } from 'shared/api';

export async function logout() {
  await cloudApi.auth.logout();
  viewerModel.setUnauthorized();
}
