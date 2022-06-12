import { AxiosPromise } from 'axios';
import { api } from './base';
import { ChangePasswordDto, SignInDto, SignUpDto } from './models';

const BASE_URL = '/api/v1/auth';

export function signUp(data: SignUpDto): AxiosPromise<void> {
  return api.post(`${BASE_URL}/sign-up`, data);
}

export function signIn(data: SignInDto): AxiosPromise<void> {
  return api.post(`${BASE_URL}/sign-in`, data);
}

export function logout(): AxiosPromise<void> {
  return api.post(`${BASE_URL}/logout`);
}

export function changePassword(data: ChangePasswordDto): AxiosPromise<void> {
  return api.put(`${BASE_URL}/password`, data);
}
