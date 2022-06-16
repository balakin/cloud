export type ErrorPayloadExtractor<Payload> = (error: unknown) => Payload;

export type Action<Argument, ErrorPayload> = {
  execute: (argument: Argument) => Promise<void>;
  errorPayloadExtractor: ErrorPayloadExtractor<ErrorPayload>;
};

export type FormError = {
  message: string | null;
  fields: Record<string, string>;
};
