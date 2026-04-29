import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.less';
import './styles/style.css';
import { initFaro } from '@/faro';
import { isLocal, isProd } from '@/utils/miljoUtil';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { FilterProvider } from '@/context/filters/FilterContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queryClient';
import AppRouter from '@/routers/AppRouter';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

initFaro();

function addUmamiScript() {
  const [dataWebsiteId, src] = isProd()
    ? [
        'ef4034fe-08a4-42a6-8f3c-e24751455026',
        'https://cdn.nav.no/team-researchops/sporing/sporing.js',
      ]
    : [
        'cf79c0cd-bba6-45dc-a1ff-8ba2d6915ad3',
        'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js',
      ];
  const script = document.createElement('script');
  script.setAttribute('data-website-id', dataWebsiteId);
  script.setAttribute('src', src);
  script.setAttribute('data-before-send', 'beforeSendHandler');
  script.setAttribute('defer', 'defer');
  document.head.appendChild(script);
}

async function setupMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: {
        scope: '/',
      },
    },
  });
}

function renderApp() {
  const container =
    document.getElementById('maincontent') || new DocumentFragment();
  const root = createRoot(container);

  addUmamiScript();
  if (isLocal()) {
    setupMocking().then(() => root.render(<App />));
  } else {
    root.render(<App />);
  }
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AktivEnhetProvider>
          <FilterProvider>
            <QueryClientProvider client={queryClient}>
              <AppRouter />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </FilterProvider>
        </AktivEnhetProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

renderApp();
