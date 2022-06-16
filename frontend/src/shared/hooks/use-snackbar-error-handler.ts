import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export function useSnackbarErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (error: string | null) => {
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  return handleError;
}
