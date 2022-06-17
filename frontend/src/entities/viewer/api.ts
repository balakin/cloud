import { useQuery } from 'react-query';
import { cloudApi } from 'shared/api';
import { VIEWER_QUERY_KEY } from './constants';
import { useIsAuth } from './hooks';

export function useViewerQuery() {
  const isAuth = useIsAuth();
  return useQuery(
    VIEWER_QUERY_KEY,
    async ({ signal }) => {
      const response = await cloudApi.user.me({ signal });
      return response.data;
    },
    { enabled: isAuth ?? false }
  );
}
