export type User = {
  id: string;
  userName: string;
};

export type SignUpDto = {
  userName: string;
  password: string;
};

export type SignInDto = {
  userName: string;
  password: string;
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors?: Record<string, string[]>;
};
