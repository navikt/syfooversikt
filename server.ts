import express from 'express';
import helmet from 'helmet';
import path from 'path';
import prometheus from 'prom-client';

import { validateToken } from './server/authUtils.js';
import { setupProxy } from './server/proxy.js';
import { getUnleashToggles } from './server/unleash.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'", 'https://*.nav.no'],
        'script-src': ["'self'", "'unsafe-inline'", 'https://*.nav.no'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://*.nav.no'],
        'font-src': ["'self'", 'data:', 'https://*.nav.no'],
        'connect-src': ["'self'", 'https://*.nav.no', 'wss://*.nav.no'],
      },
    },
  })
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
  if (await validateToken(req)) {
    next();
  } else {
    res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
  }
};

const setupServer = async () => {
  const DIST_DIR = path.join(__dirname, 'dist');
  const HTML_FILE = path.join(DIST_DIR, 'index.html');

  server.use(setupProxy());

  server.get(
    '/unleash/toggles',
    redirectIfUnauthorized,
    (req: express.Request, res: express.Response) => {
      const togglesResponse = getUnleashToggles(
        req.query.veilederId,
        req.query.enhetId
      );
      res.status(200).send(togglesResponse);
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

  server.use('/', express.static(DIST_DIR));

  server.get(
    ['/*'],
    [nocache, redirectIfUnauthorized],
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (path.extname(req.path)) {
        return next();
      }

      res.sendFile(HTML_FILE);
    }
  );

  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
};

setupServer();
