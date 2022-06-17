import { AxiosPromise } from 'axios';
import { nameof } from 'shared/lib';
import { api } from './base';
import { ChangeAvatarDto, User } from './models';

const BASE_URL = '/api/v1/users';

export type MeOptions = {
  signal?: AbortSignal;
};

export function me(options?: MeOptions): AxiosPromise<User> {
  return api.get(`${BASE_URL}/@me`, { signal: options?.signal });
}

export function changeAvatar(data: ChangeAvatarDto): AxiosPromise<User> {
  const formData = new FormData();
  formData.append(nameof<ChangeAvatarDto>('file'), data.file);
  return api.patchForm(`${BASE_URL}/@me/avatar`, formData);
}

export function deleteAvatar(): AxiosPromise<User> {
  return api.delete(`${BASE_URL}/@me/avatar`);
}
