import { AxiosPromise } from 'axios';
import { useErrorHandler } from 'react-error-boundary';
import { useInfiniteQuery } from 'react-query';
import { cloudApi, FolderChildrenDto, OffsetPagination } from 'shared/api';
import { CHILDREN_QUERY_KEY, QUERY_KEY } from '../constants';

export const PAGE_SIZE = 200;

export type FolderChildren = {
  count: number;
  children: Array<FolderChild>;
};

export type FolderChild = {
  kind: 'folder' | 'file';
  id: string;
  name: string;
};

export function useFolderChildren(folderId: string | null) {
  const handleError = useErrorHandler();
  return useInfiniteQuery(
    [QUERY_KEY, folderId, CHILDREN_QUERY_KEY],
    async ({ signal, pageParam }) => {
      const pagination: OffsetPagination = pageParam ?? {
        offset: 0,
        pageSize: PAGE_SIZE,
      };

      let response: AxiosPromise<FolderChildrenDto> | null = null;
      if (folderId === null) {
        response = cloudApi.folders.getRootChildren(pagination, signal);
      } else {
        response = cloudApi.folders.getFolderChildren(folderId, pagination, signal);
      }

      const { data } = await response;
      return {
        count: data.count,
        children: [
          ...data.folders.map<FolderChild>(({ id, name }) => ({ kind: 'folder', id, name })),
          ...data.files.map<FolderChild>(({ id, name }) => ({ kind: 'file', id, name })),
        ],
      } as FolderChildren;
    },
    {
      onError: (error) => {
        handleError(error);
      },
      getNextPageParam: (lastPage, allPages) => {
        const offset = allPages.length * PAGE_SIZE;
        if (offset >= lastPage.count) {
          return undefined;
        }

        return {
          offset,
          pageSize: PAGE_SIZE,
        } as OffsetPagination;
      },
    }
  );
}
