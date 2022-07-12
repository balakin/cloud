import { AxiosPromise } from 'axios';
import { nameof } from 'shared/lib';
import { api } from './base';
import { ChangeFileDto, FileInfoDto, UploadFileDto } from './models';

const BASE_URL = '/api/v1/files';

export type UploadFilesProgressCallback = (fileInfo: FileInfoDto, index: number) => void;

export type UploadFileProgressCallback = (loaded: number) => void;

export type UploadFilesData = {
  files: Array<File>;
  folderId: string | null;
  progressCallback?: UploadFilesProgressCallback;
  onUploadProgress?: UploadFileProgressCallback;
  signal?: AbortSignal;
};

export async function uploadFiles({
  files,
  folderId,
  progressCallback,
  onUploadProgress,
  signal,
}: UploadFilesData): Promise<void> {
  const gap = 100;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const response = await uploadFile({ file, folderId }, onUploadProgress, signal);
    progressCallback && progressCallback(response.data as FileInfoDto, i);
    if (i + 1 !== files.length) {
      await new Promise((resolve) => setTimeout(resolve, gap));
    }
  }
}

export function uploadFile(
  { file, folderId }: UploadFileDto,
  onUploadProgress?: UploadFileProgressCallback,
  signal?: AbortSignal
): AxiosPromise<FileInfoDto> {
  const formData = new FormData();

  const fullName = typeof (file as any).path === 'string' ? (file as any).path : file.name;
  formData.append(nameof<UploadFileDto>('file'), file, fullName);

  if (folderId) {
    formData.append(nameof<UploadFileDto>('folderId'), folderId);
  }

  return api.postForm(`${BASE_URL}`, formData, {
    signal,
    onUploadProgress: (event) => {
      onUploadProgress && onUploadProgress(event.loaded);
    },
  });
}

export function getFileUrl(id: string): string {
  return `${BASE_URL}/${id}`;
}

export function downloadFile(id: string): void {
  window.location.href = `${BASE_URL}/${id}/download`;
}

export function getFileInfo(id: string): AxiosPromise<FileInfoDto> {
  return api.get(`${BASE_URL}/${id}/info`);
}

export function changeFile(id: string, data: ChangeFileDto): AxiosPromise<FileInfoDto> {
  return api.patch(`${BASE_URL}/${id}`, data);
}

export function deleteFile(id: string): AxiosPromise<void> {
  return api.delete(`${BASE_URL}/${id}`);
}
