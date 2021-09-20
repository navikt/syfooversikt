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

const App = () => {
  return (
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
  );
};

render(<App />, document.getElementById('maincontent'));
