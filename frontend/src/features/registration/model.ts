import { cloudApi, SignUpDto } from 'shared/api';

export async function signUp(dto: SignUpDto) {
  await cloudApi.auth.signUp(dto);
}
