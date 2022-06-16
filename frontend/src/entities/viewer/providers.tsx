import { AxiosError } from 'axios';
import { FC, PropsWithChildren, useEffect } from 'react';
import { cloudHelpers } from 'shared/helpers';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { useViewerQuery } from './api';
import { ViewerContext, ViewerContextValue } from './contexts';
import { setUnauthorized } from './model';

export type ViewerProviderProps = PropsWithChildren<{}>;

export const ViewerProvider: FC<ViewerProviderProps> = ({ children }) => {
  const { data, error, isLoading, isError, isIdle, refetch } = useViewerQuery();
  const handleError = useSnackbarErrorHandler();

  const value: ViewerContextValue = {
    viewer: isIdle || !data ? null : data,
    error,
    isLoading,
    isError,
    refetch: async () => {
      await refetch();
    },
  };

  useEffect(() => {
    if (!isError) {
      return;
    }

    if (error instanceof AxiosError && error.response?.status === 401) {
      setUnauthorized();
    }

    const errorMessage = cloudHelpers.getErrorMessage(error);
    handleError(errorMessage);
  }, [handleError, error, isError]);

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};
