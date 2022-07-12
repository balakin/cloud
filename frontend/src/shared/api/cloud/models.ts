export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors?: Record<string, string[]>;
};

export type OffsetPagination = {
  offset: number;
  pageSize: number;
};

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

export type UploadFileDto = {
  file: File;
  folderId: string | null;
};

export type FileInfoDto = {
  id: string;
  name: string;
  contentType: string;
  size: number;
};

export type ChangeFileDto = {
  name: string;
};

export type CreateFolderDto = {
  name: string;
  parentId: string | null;
};

export type FolderDto = {
  id: string;
  name: string;
};

export type FolderChildrenDto = {
  folders: FolderDto[];
  files: FileInfoDto[];
  count: number;
};

export type FolderPathDto = {
  parts: FolderDto[];
};

export type ChangeFolderDto = {
  name: string;
};
