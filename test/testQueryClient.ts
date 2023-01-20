import { QueryClient } from '@tanstack/react-query';

export const testQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {
        /*empty*/
      },
    },
  });
