import { useCallback, useEffect, useRef, useState } from 'react';
import { Action } from 'shared/types';
import { useIsMountedRef } from './use-is-mounted-ref';

export type UseActionReturn<ActionType extends Action<any, any>> =
  | UseActionReturnError<ActionType>
  | UseActionReturnOther<ActionType>;

type UseActionReturnError<ActionType extends Action<any, any>> = {
  isPending: boolean;
  isError: true;
  errorPayload: ReturnType<ActionType['errorPayloadExtractor']>;
  execute: ActionExecutor<ActionType>;
};

type UseActionReturnOther<ActionType extends Action<any, any>> = {
  isPending: boolean;
  isError: false;
  errorPayload: null;
  execute: ActionExecutor<ActionType>;
};

type ActionExecutor<ActionType extends Action<any, any>> = (
  arg: Parameters<ActionType['execute']>[0]
) => Promise<UseActionResult<ActionType>>;

export type UseActionResult<ActionType extends Action<any, any>> =
  | UseActionResultError<ActionType>
  | UseActionResultOther;

type UseActionResultError<ActionType extends Action<any, any>> = {
  isSuccess: false;
  errorPayload: ReturnType<ActionType['errorPayloadExtractor']>;
};

export type UseActionResultOther = {
  isSuccess: true;
  errorPayload: null;
};

export function useAction<ActionType extends Action<any, any>>(action: ActionType): UseActionReturn<ActionType> {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<UseActionResult<ActionType>['errorPayload']>(null);
  const isMountedRef = useIsMountedRef();
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const execute = useCallback<ActionExecutor<ActionType>>(
    async (arg) => {
      setIsPending(true);
      setIsError(false);
      try {
        await actionRef.current.execute(arg);
        return {
          isSuccess: true,
          errorPayload: null,
        } as UseActionResultOther;
      } catch (error) {
        const payload = actionRef.current.errorPayloadExtractor(error);
        if (isMountedRef.current) {
          setError(payload as UseActionResult<ActionType>['errorPayload']);
          setIsError(true);
        }

        return {
          isSuccess: false,
          errorPayload: payload as UseActionResult<ActionType>['errorPayload'],
        } as UseActionResultError<ActionType>;
      } finally {
        if (isMountedRef.current) {
          setIsPending(false);
        }
      }
    },
    [isMountedRef]
  );

  if (isError) {
    return {
      isPending,
      isError: true,
      errorPayload: error as UseActionResultError<ActionType>['errorPayload'],
      execute,
    };
  } else {
    return {
      isPending,
      isError: false,
      errorPayload: null,
      execute,
    };
  }
}
