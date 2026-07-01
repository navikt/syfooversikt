import { QueryCache, QueryClient } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { is4xxError } from "@/api/errors";
import "@tanstack/react-query";

/**
 * Maximum number of automatic retry attempts for a failed query, in addition to
 * the initial request.
 */
export const MAX_QUERY_RETRIES = 3;

/**
 * Determines whether a failed query should be retried.
 *
 * Client errors (HTTP 4xx, including 401 and 403) are never retried since they
 * will not succeed on a subsequent attempt. Other failures (network errors,
 * 5xx, etc.) are retried up to {@link MAX_QUERY_RETRIES} times.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (is4xxError(error)) {
    return false;
  }
  return failureCount < MAX_QUERY_RETRIES;
}

interface Meta extends Record<string, unknown> {
  handleError: (error: Error) => void;
  handleSuccess: () => void;
}

declare module "@tanstack/react-query" {
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
      networkMode: "offlineFirst",
    },
    queries: {
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      gcTime: minutesToMillis(60),
      staleTime: minutesToMillis(30),
      retry: shouldRetryQuery,
    },
  },
});
