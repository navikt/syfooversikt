require('dotenv').config();

const express = require('express');
const path = require('path');
const prometheus = require('prom-client');
const getChangelogs = require('./server/changelogReader.js');

const Auth = require('./server/auth/index');

const setupProxy = require('./server/proxy.js');

// Prometheus metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});

const server = express();

server.use(express.json());

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

const setupServer = async () => {
  const authClient = await Auth.setupAuth(server);

  const DIST_DIR = path.join(__dirname, 'dist');
  const HTML_FILE = path.join(DIST_DIR, 'index.html');

  server.use('/static', express.static(DIST_DIR));

  server.use(setupProxy(authClient));

  server.get('/syfooversikt/changelogs', (req, res) => {
    res.send(getChangelogs());
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
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
  });

  server.get(
    ['*', '/syfooversikt/?', /^\/syfooversikt\/(?!(resources|img)).*$/],
    nocache,
    (req, res) => {
      res.sendFile(HTML_FILE);
      httpRequestDurationMicroseconds.labels(req.path).observe(10);
    }
  );

  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
};

setupServer();
