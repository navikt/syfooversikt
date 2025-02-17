import { QueryCache, QueryClient } from '@tanstack/react-query';
import { minutesToMillis } from '@/utils/timeUtils';
import { isClientError } from '@/api/errors';
import '@tanstack/react-query';

interface Meta extends Record<string, unknown> {
  handleError: (error: Error) => void;
  handleSuccess: () => void;
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: Meta;
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.handleError) {
        query.meta.handleError(error);
      }
    },
    onSuccess: (_, query) => {
      if (query.meta?.handleSuccess) {
        query.meta.handleSuccess();
      }
    },
  }),
  defaultOptions: {
    mutations: {
      networkMode: 'offlineFirst',
    },
    queries: {
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      gcTime: minutesToMillis(60),
      staleTime: minutesToMillis(30),
      retry: (failureCount, error) => {
        if (isClientError(error)) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});
