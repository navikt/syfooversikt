import { getWebInstrumentations, initializeFaro } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { isDev, isLocal } from '@/utils/miljoUtil';

const getUrl = () => {
  if (isLocal()) {
    return '/collect';
  } else if (isDev()) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  } else {
    return 'https://telemetry.nav.no/collect';
  }
};

export const initFaro = () =>
  initializeFaro({
    url: getUrl(),
    app: { name: 'syfooversikt' },
    paused: isLocal(),
    instrumentations: [
      ...getWebInstrumentations({ captureConsole: false }),
      new TracingInstrumentation(),
    ],
  });
