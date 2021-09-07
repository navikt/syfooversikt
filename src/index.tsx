import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import './styles/styles.less';
import AppRouter from './routers/AppRouter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import * as Sentry from '@sentry/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      useErrorBoundary: true,
    },
  },
});

Sentry.init({
  dsn: 'https://21a6a067685146d799d27a2b4bc7f3d2@sentry.gc.nav.no/92',
});

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const App = () => {
  return <AppContent />;
};

render(<App />, document.getElementById('maincontent'));
