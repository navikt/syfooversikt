require('dotenv').config();

const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const prom_client = require('prom-client');
const counters = require('./server/counters');
const changelogs = require('./server/changelogReader');
const proxy = require('express-http-proxy');

const localhost = 'https://localhost:8080';

const envVar = ({ name, defaultValue }) => {
  const fromEnv = process.env[name];
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof defaultValue === 'string') {
    return defaultValue;
  }
  throw new Error(`Missing required environment variable ${name}`);
};
const hosts = {
  modiacontextholder: envVar({
    name: 'MODIACONTEXTHOLDER_HOST',
    defaultValue: localhost,
  }),
  syfomoteadmin: envVar({
    name: 'SYFOMOTEADMIN_HOST',
    defaultValue: localhost,
  }),
  syfooversiktsrv: envVar({
    name: 'SYFOOVERSIKTSRV_HOST',
    defaultValue: localhost,
  }),
  syfoperson: envVar({
    name: 'SYFOPERSON_HOST',
    defaultValue: localhost,
  }),
  syfoveileder: envVar({
    name: 'SYFOVEILEDER_HOST',
    defaultValue: localhost,
  }),
};

// Prometheus metrics
const setupMetrics = () => {
  const collectDefaultMetrics = prom_client.collectDefaultMetrics;
  collectDefaultMetrics({ timeout: 5000 });

  const Registry = prom_client.Registry;
  const register = new Registry();

  register.registerMetric(counters.httpRequestDurationMicroseconds);
  register.registerMetric(counters.userFilterMotebehovCounter);
  register.registerMetric(counters.userFilterMoteplanleggerCounter);
  register.registerMetric(counters.userFilterUfordelteCounter);
  register.registerMetric(counters.userFilterIkkeAktivitetCounter);
  register.registerMetric(counters.userFilterVeilederSearchCounter);
  register.registerMetric(counters.userFilterCompanyCounter);
  register.registerMetric(counters.userFilterBirthdayCounter);

  collectDefaultMetrics({ register });
  return register;
};
const prometheus = setupMetrics();

const server = express();

const env = process.argv[2];
const settings =
  env === 'local' ? { isProd: false } : require('./settings.json');

server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

changelogs.readChangelogDir();

const renderApp = () => {
  return new Promise((resolve, reject) => {
    server.render('index.html', Object.assign({}, settings), (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

const startServer = (html) => {
  server.use(
    '/syfooversikt/resources',
    express.static(path.resolve(__dirname, 'dist/resources'))
  );

  server.use(
    '/syfooversikt/src/img',
    express.static(path.resolve(__dirname, 'dist/resources/img'))
  );

  server.get('/syfooversikt/changelogs', (req, res) => {
    res.send(changelogs.changeLogCache);
  });

  server.get(
    '/syfooversikt/changelogs/image/:changelogId/:imageName',
    (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          'changelogs',
          req.params.changelogId,
          req.params.imageName
        )
      );
    }
  );

  server.get('/health/isAlive', (req, res) => {
    res.sendStatus(200);
  });

  server.get('/health/isReady', (req, res) => {
    res.sendStatus(200);
  });

  server.get('/actuator/metrics', (req, res) => {
    res.set('Content-Type', prometheus.contentType);
    res.end(prometheus.metrics());
  });

  server.post('/metrics/actions/filters/:type', (req, res) => {
    const counterPostfix = req.params.type ? req.params.type : '';
    const counterKey = counters.getMetricName(
      counters.METRIC_FILTER_INFIX,
      counterPostfix
    );
    prometheus.getSingleMetric(counterKey).inc(1, new Date());
    res.sendStatus(200);
  });

  if (env === 'local' || env === 'opplaering') {
    console.log('Setter opp lokale mock-endepunkter');
    require('./Mock/mockEndepunkter').mockForLokal(server);
  } else {
    server.use(
      '/api',
      proxy(hosts.syfooversiktsrv, {
        https: true,
        proxyReqPathResolver: function (req) {
          return `/api${req.path}`;
        },
        proxyErrorHandler: function (err, res, next) {
          console.error('Error in proxy for syfooversiktsrv', err);
          next(err);
        },
      })
    );
    server.use(
      '/modiacontextholder/api',
      proxy(hosts.modiacontextholder, {
        https: true,
        proxyReqPathResolver: function (req) {
          return `/modiacontextholder/api${req.url}`;
        },
        proxyErrorHandler: function (err, res, next) {
          console.error('Error in proxy for modiacontextholder', err);
          next(err);
        },
      })
    );
    server.use(
      '/syfomoteadmin/api',
      proxy(hosts.syfomoteadmin, {
        https: true,
        proxyReqPathResolver: function (req) {
          return `/syfomoteadmin/api${req.url}`;
        },
        proxyErrorHandler: function (err, res, next) {
          console.error('Error in proxy for syfomoteadmin', err);
          next(err);
        },
      })
    );
    server.use(
      '/syfoperson/api',
      proxy(hosts.syfoperson, {
        https: true,
        proxyReqPathResolver: function (req) {
          return `/syfoperson/api${req.url}`;
        },
        proxyErrorHandler: function (err, res, next) {
          console.error('Error in proxy for syfoperson', err);
          next(err);
        },
      })
    );
    server.use(
      '/syfoveileder/api',
      proxy(hosts.syfoveileder, {
        https: true,
        proxyReqPathResolver: function (req) {
          return `/syfoveileder/api${req.url}`;
        },
        proxyErrorHandler: function (err, res, next) {
          console.error('Error in proxy for syfoveileder', err);
          next(err);
        },
      })
    );
  }

  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });

  server.use(
    ['*', '/syfooversikt/?', /^\/syfooversikt\/(?!(resources|img)).*$/],
    nocache,
    (req, res) => {
      res.send(html);
      prometheus
        .getSingleMetric('http_request_duration_ms')
        .labels(req.path)
        .observe(10);
    }
  );
};

const logError = (errorMessage, details) => {
  console.log(errorMessage, details);
};

renderApp().then(startServer, (error) => {
  logError('Failed to render app', error);
});
