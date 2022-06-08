import { AxiosError } from 'axios';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useViewerQuery } from './api';
import { ViewerContext, ViewerContextValue } from './contexts';
import { setUnauthorized } from './model';

export type ViewerProviderProps = PropsWithChildren<{}>;

export const ViewerProvider: FC<ViewerProviderProps> = ({ children }) => {
  const { data, error, isLoading, isError, isIdle } = useViewerQuery();

  const value: ViewerContextValue = {
    viewer: isIdle || !data ? null : data,
    error,
    isLoading,
    isError,
  };

  useEffect(() => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      setUnauthorized();
    }
  }, [error]);

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};
