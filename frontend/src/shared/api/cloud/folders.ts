import { AxiosPromise } from 'axios';
import { api } from './base';
import {
  ChangeFolderDto,
  CreateFolderDto,
  FolderChildrenDto,
  FolderDto,
  FolderPathDto,
  OffsetPagination,
} from './models';

const BASE_URL = '/api/v1/folders';

export function createFolder(data: CreateFolderDto): AxiosPromise<FolderDto> {
  return api.post(`${BASE_URL}`, data);
}

export function getFolder(id: string, signal?: AbortSignal): AxiosPromise<FolderDto> {
  return api.get(`${BASE_URL}/${id}`, { signal });
}

export function getRootChildren(pagination: OffsetPagination, signal?: AbortSignal): AxiosPromise<FolderChildrenDto> {
  return api.get(`${BASE_URL}/@root/children`, { params: pagination, signal });
}

export function getFolderChildren(
  id: string,
  pagination: OffsetPagination,
  signal?: AbortSignal
): AxiosPromise<FolderChildrenDto> {
  return api.get(`${BASE_URL}/${id}/children`, { params: pagination, signal });
}

export function getFolderPath(id: string, signal?: AbortSignal): AxiosPromise<FolderPathDto> {
  return api.get(`${BASE_URL}/${id}/path`, { signal });
}

export function changeFolder(id: string, data: ChangeFolderDto): AxiosPromise<ChangeFolderDto> {
  return api.patch(`${BASE_URL}/${id}`, data);
}

export function deleteFolder(id: string): AxiosPromise<void> {
  return api.delete(`${BASE_URL}/${id}`);
}
