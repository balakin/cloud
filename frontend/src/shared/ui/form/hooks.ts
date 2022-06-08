import { useState } from 'react';

export function useDependenciesKey(dependencies?: Array<unknown>) {
  const [key, setKey] = useState(1);
  const [cached, setCached] = useState<Array<unknown> | null>(null);

  if (isChanged(cached, dependencies ?? null)) {
    if (cached !== null) {
      setKey((key) => -key);
    }

    setCached(dependencies ?? null);
  }

  return key;
}

function isChanged(cached: Array<unknown> | null, dependencies: Array<unknown> | null) {
  if (dependencies === undefined || dependencies === null) {
    if (cached !== null) {
      return true;
    }

    return false;
  }

  if (!Array.isArray(dependencies)) {
    throw new Error('Dependencies must be array.');
  }

  if (cached === null) {
    return true;
  }

  if (cached.length !== dependencies.length) {
    return true;
  }

  if (dependencies.some((value, index) => cached[index] !== value)) {
    return true;
  }

  return false;
}
