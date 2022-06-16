import { AxiosError } from 'axios';
import { isDev } from 'shared/config';
import { extractProblemDetails } from './extract-problem-details';
import { getErrorMessage as fallback } from 'shared/lib';
import { ErrorPayloadExtractor } from 'shared/types';

export const getErrorMessage: ErrorPayloadExtractor<string> = (error) => {
  if (error instanceof AxiosError && error.response && error.response.status === 400) {
    try {
      const problemDetails = extractProblemDetails(error);
      if (problemDetails.errors && problemDetails.errors[''] && problemDetails.errors[''][0]) {
        return problemDetails.errors[''][0];
      } else if (problemDetails.title) {
        return problemDetails.title;
      }
    } catch (error) {
      if (isDev) {
        console.error(error);
        return 'Unknown error. See console for details';
      }
    }
  }

  return fallback(error);
};
