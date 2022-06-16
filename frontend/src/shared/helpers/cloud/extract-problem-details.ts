import { AxiosError } from 'axios';
import { ProblemDetails } from 'shared/api';

export function extractProblemDetails(error: AxiosError) {
  if (!error.response) {
    throw new Error('Unable to extract problem details');
  }

  const data = error.response.data as ProblemDetails;
  if (!data.type) {
    throw new Error('Unable to extract problem details');
  }

  return data;
}
