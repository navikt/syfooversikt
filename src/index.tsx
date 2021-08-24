import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import './styles/styles.less';
import AppRouter from './routers/AppRouter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

render(<App />, document.getElementById('maincontent'));
