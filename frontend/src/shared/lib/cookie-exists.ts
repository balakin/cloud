export function cookieExists(name: string): boolean {
  const regexp = new RegExp(`(?:^|;\\s*)${name}=[^;]*`);
  return regexp.test(document.cookie);
}
