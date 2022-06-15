export type User = {
  id: string;
  userName: string;
  avatarId: string;
};

export type SignUpDto = {
  userName: string;
  password: string;
};

export type SignInDto = {
  userName: string;
  password: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

export type ChangeAvatarDto = {
  file: File;
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors?: Record<string, string[]>;
};
