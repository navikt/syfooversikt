import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.less';
import './styles/style.css';
import AppRouter from './routers/AppRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FilterProvider } from '@/context/filters/FilterContext';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { initFaro } from '@/faro';
import { isLocal, isProd } from '@/utils/miljoUtil';
import { queryClient } from '@/queryClient';

initFaro();

const App = () => {
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
};

const container =
  document.getElementById('maincontent') || new DocumentFragment();
const root = createRoot(container);

function addUmamiScript() {
  const dataWebsiteId = isProd()
    ? 'ef4034fe-08a4-42a6-8f3c-e24751455026'
    : 'cf79c0cd-bba6-45dc-a1ff-8ba2d6915ad3';
  const script = document.createElement('script');
  script.setAttribute('data-host-url', 'https://umami.nav.no');
  script.setAttribute('data-website-id', dataWebsiteId);
  script.setAttribute(
    'src',
    'https://cdn.nav.no/team-researchops/sporing/sporing.js'
  );
  script.setAttribute('defer', 'defer');
  document.head.appendChild(script);
}

function renderApp() {
  if (!isLocal()) {
    addUmamiScript();
  }
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
