const prom_client = require('prom-client');

const Histogram = prom_client.Histogram;
const Counter = prom_client.Counter;

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

const userFilterMotebehovCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'motebehov'),
  help:
    'Number of times the filter for showing users requesting a meeting was selected',
});

const userFilterMoteplanleggerCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'moteplanlegger'),
  help:
    'Number of times the filter for showing users requesting a meeting was selected',
});

const userFilterUfordelteCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'ufordelte'),
  help:
    'Number of times the filter for showing users requesting a meeting was selected',
});

const userFilterIkkeAktivitetCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'ikkeaktivitet'),
  help:
    'Number of times the filter for showing users with any activity was selected',
});

const userFilterVeilederSearchCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'veiledersok'),
  help: 'Number of times the filter for searching veileders was selected',
});

const userFilterCompanyCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'virksomheter'),
  help: 'Number of times the filter for showing users by company was selected',
});

const userFilterBirthdayCounter = new Counter({
  name: getMetricName(METRIC_FILTER_INFIX, 'fodselsdato'),
  help:
    'Number of times the filter for searching users by birthday was selected',
});

module.exports = {
  getMetricName,
  APP_METRIC_PREFIX,
  METRIC_FILTER_INFIX,
  httpRequestDurationMicroseconds,
  userFilterMotebehovCounter,
  userFilterMoteplanleggerCounter,
  userFilterUfordelteCounter,
  userFilterIkkeAktivitetCounter,
  userFilterVeilederSearchCounter,
  userFilterCompanyCounter,
  userFilterBirthdayCounter,
};
