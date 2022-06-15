import { AxiosPromise } from 'axios';
import { api } from './base';
import { ChangeAvatarDto, User } from './models';

const BASE_URL = '/api/v1/users';

export type MeOptions = {
  signal?: AbortSignal;
};

export function me(options?: MeOptions): AxiosPromise<User> {
  return api.get(`${BASE_URL}/@me`, { signal: options?.signal });
}

export function changeAvatar(data: ChangeAvatarDto): AxiosPromise<void> {
  const formData = new FormData();
  formData.append('file', data.file);
  return api.put(`${BASE_URL}/@me/avatar`, formData);
}

export function deleteAvatar(): AxiosPromise<void> {
  return api.delete(`${BASE_URL}/@me/avatar`);
}
