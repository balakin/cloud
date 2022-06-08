export function url(endpoint: string, searchParams: URLSearchParams) {
  const params = searchParams.toString();
  return `${endpoint}${params ? `?${params}` : ''}`;
}
