const prefix = 'CLOUD_';

window.addEventListener('storage', (event) => {
  if (event.storageArea !== localStorage) {
    return;
  }

  const { key } = event;
  if (key && isStoreKey(key)) {
    const name = getItemName(key);
    const value = event.newValue ?? null;
    notifyListeners(name, value);
  }
});

export type PersistentStoreChangeListener = (name: string, value: unknown) => void;

export const persistentStore = Object.freeze({
  setItem(name: string, value: unknown) {
    if (value) {
      const converted = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(`${prefix}${name}`, converted);
    } else {
      localStorage.removeItem(`${prefix}${name}`);
    }

    notifyListeners(name, value);
  },

  getItem<T>(name: string): T | null {
    const value = localStorage.getItem(`${prefix}${name}`);
    if (value) {
      return JSON.parse(value) as T;
    }

    return null;
  },

  deleteItem(name: string) {
    this.setItem(name, null);
  },

  addChangeListener(listener: PersistentStoreChangeListener) {
    listeners.add(listener);
  },

  removeChangeListener(listener: PersistentStoreChangeListener) {
    listeners.delete(listener);
  },

  clear() {
    const names = [];
    const { length } = localStorage;
    for (let i = 0; i < length; i += 1) {
      const key = localStorage.key(i);
      if (key && isStoreKey(key)) {
        names.push(getItemName(key));
      }
    }

    names.forEach((name) => {
      this.deleteItem(name);
    });
  },
});

const listeners = new Set<PersistentStoreChangeListener>();

function notifyListeners(name: string, value: unknown) {
  listeners.forEach((listener) => listener(name, value));
}

function isStoreKey(key: string) {
  return key.startsWith(prefix);
}

function getItemName(key: string) {
  return key.substring(prefix.length);
}
