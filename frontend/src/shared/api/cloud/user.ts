import { AxiosPromise } from 'axios';
import { api } from './base';
import { User } from './models';

const BASE_URL = '/api/v1/users';

export type MeOptions = {
  signal?: AbortSignal;
};

export function me(options?: MeOptions): AxiosPromise<User> {
  return api.get(`${BASE_URL}/@me`, { signal: options?.signal });
}
