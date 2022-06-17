import { useEffect, useState } from 'react';

export function useObjectUrl(obj: Blob | MediaSource | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!obj) {
      return;
    }

    const url = URL.createObjectURL(obj);
    setUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setUrl(null);
    };
  }, [obj]);

  return url;
}
