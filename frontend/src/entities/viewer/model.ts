import { persistentStore } from 'shared/lib';
import { IS_AUTH_KEY } from './constants';

export function setAuthorized() {
  persistentStore.setItem(IS_AUTH_KEY, true);
}

export function setUnauthorized() {
  persistentStore.setItem(IS_AUTH_KEY, false);
}
