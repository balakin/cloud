import { ChangePasswordDto, cloudApi } from 'shared/api';

export async function changePassword(dto: ChangePasswordDto) {
  await cloudApi.auth.changePassword(dto);
}
