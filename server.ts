import express from 'express';
import helmet from 'helmet';
import path from 'path';
import prometheus from 'prom-client';
import { getChangelogs } from './server/changelogReader';

import * as Config from './server/config';
import { getOpenIdClient, getOpenIdIssuer } from './server/authUtils';
import { setupProxy } from './server/proxy';
import { setupSession } from './server/session';
import { getUnleashToggles } from './server/routes/unleashRoutes';

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

server.use(express.json() as any);
server.use(
  helmet({
    contentSecurityPolicy: false,
  }) as any
);

const nocache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};

const redirectIfUnauthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.headers['authorization']) {
    next();
  } else {
    res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
  }
};

const setupServer = async () => {
  setupSession(server);
  const issuer = await getOpenIdIssuer();
  const authClient = await getOpenIdClient(issuer);

  const DIST_DIR = path.join(__dirname, 'dist');
  const HTML_FILE = path.join(DIST_DIR, 'index.html');

  server.use('/static', express.static(DIST_DIR));

  server.post('/unleash/toggles', (req, res) => {
    const toggles = req.body.toggles;
    const unleashToggles = getUnleashToggles(
      toggles,
      req.query.valgtEnhet,
      req.query.userId
    );

    res.status(200).send(unleashToggles);
  });

  server.use(setupProxy(authClient, issuer));

  server.get('/syfooversikt/changelogs', (req, res) => {
    res.send(getChangelogs());
  });

  server.get(
    '/syfooversikt/changelogs/image/:changelogId/:imageName',
    (req: any, res) => {
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
    [nocache, redirectIfUnauthorized],
    (req: express.Request, res: express.Response) => {
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
