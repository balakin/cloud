import { useEffect, useState } from 'react';
import { persistentStore, PersistentStoreChangeListener } from 'shared/lib';

export function usePersistentStore<T>(key: string): T | null {
  const [value, setValue] = useState<T | null>(() => persistentStore.getItem(key));

  useEffect(() => {
    const listener: PersistentStoreChangeListener = (name, value) => {
      if (name === key) {
        setValue(value as T | null);
      }
    };

    persistentStore.addChangeListener(listener);

    return () => {
      persistentStore.removeChangeListener(listener);
    };
  }, [key]);

  return value;
}
