import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.less';
import AppRouter from './routers/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FilterProvider } from '@/context/filters/FilterContext';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { TabTypeProvider } from '@/context/tab/TabTypeContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { minutesToMillis } from '@/utils/timeUtils';
import { initAmplitude } from '@/amplitude/amplitude';
import { isClientError } from '@/api/errors';
import ErrorBoundary from '@/components/error/ErrorBoundary';

initAmplitude();

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: 'offlineFirst',
    },
    queries: {
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      cacheTime: minutesToMillis(60),
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

const App = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <TabTypeProvider>
          <AktivEnhetProvider>
            <FilterProvider>
              <QueryClientProvider client={queryClient}>
                <AppRouter />
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </FilterProvider>
          </AktivEnhetProvider>
        </TabTypeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

const container =
  document.getElementById('maincontent') || new DocumentFragment();
const root = createRoot(container);

root.render(<App />);
