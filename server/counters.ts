import promClient from 'prom-client';

const Histogram = promClient.Histogram;

export const APP_METRIC_PREFIX = 'syfooversikt_';
export const METRIC_FILTER_INFIX = 'bruker_filter_';

export const getMetricName = (infix: any, name: any) => {
  return `${APP_METRIC_PREFIX}${infix}${name}`;
};

export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});
