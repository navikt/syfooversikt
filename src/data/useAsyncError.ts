import { useCallback, useState } from 'react';
import { ApiErrorException } from '@/api/errors';

export function useAsyncError() {
  const [, setError] = useState();
  return useCallback(
    (e: ApiErrorException) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
}
