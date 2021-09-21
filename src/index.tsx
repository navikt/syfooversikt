import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import './styles/styles.less';
import AppRouter from './routers/AppRouter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { FilterProvider } from '@/context/filters/FilterContext';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { TabTypeProvider } from '@/context/tab/TabTypeContext';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { minutesToMillis } from '@/utils/timeUtils';
import { initAmplitude } from '@/amplitude/amplitude';

initAmplitude();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: minutesToMillis(60),
      staleTime: minutesToMillis(30),
    },
  },
});

Sentry.init({
  dsn: 'https://21a6a067685146d799d27a2b4bc7f3d2@sentry.gc.nav.no/92',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.1,
});

const App = () => {
  return (
    <ErrorBoundary context="mainPage">
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

render(<App />, document.getElementById('maincontent'));
