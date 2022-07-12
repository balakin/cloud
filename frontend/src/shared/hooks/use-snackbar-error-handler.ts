import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export function useSnackbarErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback(
    (error: string) => {
      enqueueSnackbar(error, {
        variant: 'error',
        style: { whiteSpace: 'pre-line' },
      });
    },
    [enqueueSnackbar]
  );

  return handleError;
}
