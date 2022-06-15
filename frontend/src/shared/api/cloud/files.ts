const BASE_URL = '/api/v1/files';

export function getFileUrl(id: string) {
  return `${BASE_URL}/${id}`;
}
