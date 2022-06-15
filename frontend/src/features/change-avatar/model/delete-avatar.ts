import { cloudApi } from 'shared/api';

export async function deleteAvatar() {
  await cloudApi.user.deleteAvatar();
}
