import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { cloudApi } from 'shared/api';
import { PATH_QUERY_KEY, QUERY_KEY } from '../constants';

export function useFolderPath(folderId: string) {
  const handleError = useErrorHandler();
  return useQuery(
    [QUERY_KEY, folderId, PATH_QUERY_KEY],
    async ({ signal }) => {
      const response = await cloudApi.folders.getFolderPath(folderId, signal);
      return response.data;
    },
    {
      onError: (error) => {
        handleError(error);
      },
    }
  );
}
