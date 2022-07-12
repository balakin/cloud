import axios from 'axios';
import { CLOUD_API_XSRF_COOKIE_NAME, CLOUD_API_XSRF_HEADER_NAME } from 'shared/config';
import { cookieExists } from 'shared/lib';

export const api = axios.create({
  withCredentials: true,
  xsrfCookieName: CLOUD_API_XSRF_COOKIE_NAME,
  xsrfHeaderName: CLOUD_API_XSRF_HEADER_NAME,
});

api.interceptors.request.use(async (config) => {
  if (config.signal?.aborted) {
    return config;
  }

  if (config.xsrfCookieName === undefined) {
    throw new Error('Unable to check antiforgery token');
  }

  if (!cookieExists(config.xsrfCookieName)) {
    await requestAntiforgeryToken();
  }

  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  if (axios.isCancel(error)) {
    throw error;
  }

  if (!error.config || !error.config.xsrfCookieName) {
    throw new Error('Unable to check antiforgery token');
  }

  if (!cookieExists(error.config.xsrfCookieName)) {
    await requestAntiforgeryToken();
    return api.request(error.config);
  }

  throw error;
});

async function requestAntiforgeryToken(): Promise<void> {
  await axios.get('/api/v1/antiforgery');
}
