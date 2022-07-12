import { MutationFunction } from 'react-query';

export type ErrorPayloadExtractor<TPayload> = (error: unknown) => TPayload;

export type Action<TData, TVaribles, TErrorPayload = string> = {
  mutation: MutationFunction<TData, TVaribles>;
  errorPayloadExtractor: ErrorPayloadExtractor<TErrorPayload>;
};

export type FormAction<TData, TResult> = Action<TData, TResult, FormError>;

export type FormError = {
  message: string | null;
  fields: Record<string, string>;
};

export type FolderFile = File & {
  cloudFullPath: string;
};
