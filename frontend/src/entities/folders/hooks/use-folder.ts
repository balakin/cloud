import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { cloudApi } from 'shared/api';
import { QUERY_KEY } from '../constants';

export function useFolder(folderId: string) {
  const handleError = useErrorHandler();
  return useQuery(
    [QUERY_KEY, folderId],
    async ({ signal }) => {
      const response = await cloudApi.folders.getFolder(folderId, signal);
      return response.data;
    },
    {
      onError: (error) => {
        handleError(error);
      },
    }
  );
}
