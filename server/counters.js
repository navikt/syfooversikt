const prom_client = require('prom-client');

const Histogram = prom_client.Histogram;

const APP_METRIC_PREFIX = 'syfooversikt_';
const METRIC_FILTER_INFIX = 'bruker_filter_';

const getMetricName = (infix, name) => {
  return `${APP_METRIC_PREFIX}${infix}${name}`;
};

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});

module.exports = {
  getMetricName,
  APP_METRIC_PREFIX,
  METRIC_FILTER_INFIX,
  httpRequestDurationMicroseconds,
};
