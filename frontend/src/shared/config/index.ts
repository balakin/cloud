export const NODE_ENV = process.env.NODE_ENV;

export const isDev = NODE_ENV === 'development';

export const isProd = NODE_ENV === 'production';

export const CLOUD_API_XSRF_COOKIE_NAME = env('REACT_APP_CLOUD_API_XSRF_COOKIE_NAME', 'CSRF-TOKEN');

export const CLOUD_API_XSRF_HEADER_NAME = env('REACT_APP_CLOUD_API_XSRF_HEADER_NAME', 'X-CSRF-TOKEN');

function env(key: string, defaultValue?: string): string {
  if (typeof process.env[key] !== 'string') {
    if (typeof defaultValue === 'string') {
      return defaultValue;
    }

    throw new Error(`Env variable ${key} is required`);
  }

  return process.env[key]!;
}
