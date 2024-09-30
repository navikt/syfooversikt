import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.less';
import './styles/style.css';
import AppRouter from './routers/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FilterProvider } from '@/context/filters/FilterContext';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { TabTypeProvider } from '@/context/tab/TabTypeContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { minutesToMillis } from '@/utils/timeUtils';
import { isClientError } from '@/api/errors';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { initFaro } from '@/faro';
import { isLocal } from '@/utils/miljoUtil';

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

initFaro();

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

function renderApp() {
  root.render(<App />);
}

async function setupMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

if (isLocal()) {
  setupMocking().then(() => renderApp());
} else {
  renderApp();
}
