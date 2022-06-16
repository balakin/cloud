import { AxiosError } from 'axios';
import { isDev } from 'shared/config';
import { FormError, ErrorPayloadExtractor } from 'shared/types';
import { extractProblemDetails } from './extract-problem-details';

export const getFormError: ErrorPayloadExtractor<FormError> = (error) => {
  if (error instanceof AxiosError && error.response && error.response.status === 400) {
    try {
      const problemDetails = extractProblemDetails(error);
      if (problemDetails.errors) {
        const formatted = Object.entries(problemDetails.errors).reduce(
          (previous, [key, value]) => ({ ...previous, [key]: value[0] }),
          {}
        ) as Record<string, string>;

        const message = formatted[''] || null;
        delete formatted[''];

        return {
          message,
          fields: formatted,
        };
      }
    } catch (extractError) {
      if (isDev) {
        console.error(extractError);
      }
    }
  }

  return {
    message: 'Unknown error',
    fields: {},
  };
};
