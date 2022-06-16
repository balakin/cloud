import { AxiosError } from 'axios';
import { isDev } from 'shared/config';
import { ErrorPayloadExtractor } from 'shared/types';

export const getErrorMessage: ErrorPayloadExtractor<string> = (error) => {
  if (error instanceof AxiosError && error.response) {
    switch (error.response.status) {
      case 401:
        return 'Not authorized';
      case 403:
        return 'Access is denied';
      case 404:
        return 'Not found';
    }

    if (error.response.status >= 500 && error.response.status < 600) {
      return 'Internal server error';
    }

    if (isDev) {
      console.error(error);
      return 'Unknown error. See console for details';
    } else {
      return 'Unknown error';
    }
  }

  if (error instanceof Error) {
    if (isDev) {
      console.log(error);
    }

    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
};
