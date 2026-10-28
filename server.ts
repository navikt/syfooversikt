import express from "express";
import helmet from "helmet";
import path from "path";

import { validateToken } from "./server/authUtils.js";
import { setupProxy } from "./server/proxy.js";
import { getUnleashToggles } from "./server/unleash.js";
import { fileURLToPath } from "url";
import { logger } from "@navikt/pino-logger";
import { setupCspReporting } from "./server/csp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const isProdCluster = process.env.NAIS_CLUSTER_NAME === "prod-gcp";

const connectSrcProd = [
  "wss://modiacontextholder.intern.nav.no",
  "https://telemetry.nav.no",
  "https://reops-event-proxy.nav.no",
];

const connectSrcDev = [
  "wss://modiacontextholder.intern.dev.nav.no",
  "https://telemetry.ekstern.dev.nav.no",
  "https://reops-event-proxy.ekstern.dev.nav.no",
];

server.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        scriptSrc: ["'self'", "https://cdn.nav.no"],
        // 'unsafe-inline' required while styled-components injects inline styles.
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://cdn.nav.no"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          ...(isProdCluster ? connectSrcProd : connectSrcDev),
        ],
        reportUri: ["/csp-report"],
        reportTo: ["csp-endpoint"],
      },
    },
  }),
);
setupCspReporting(server);
server.use(express.json());

const nocache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const redirectIfUnauthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (await validateToken(req)) {
    next();
  } else {
    res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
  }
};

const setupServer = async () => {
  const DIST_DIR = path.join(__dirname, "dist");
  const HTML_FILE = path.join(DIST_DIR, "index.html");

  server.use(setupProxy());

  server.get(
    "/unleash/toggles",
    redirectIfUnauthorized,
    (req: express.Request, res: express.Response) => {
      const togglesResponse = getUnleashToggles(
        req.query.veilederId,
        req.query.enhetId,
      );
      res.status(200).send(togglesResponse);
    },
  );

  server.get("/health/isAlive", (req, res) => {
    res.sendStatus(200);
  });

  server.get("/health/isReady", (req, res) => {
    res.sendStatus(200);
  });

  server.use(
    "/",
    express.static(DIST_DIR, {
      dotfiles: "allow" /* Express 5: preserve v4 behavior */,
    }),
  );

  server.get(
    ["/{*splat}"],
    [nocache, redirectIfUnauthorized],
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (path.extname(req.path)) {
        return next();
      }

      res.sendFile(HTML_FILE, {
        dotfiles: "allow" /* Express 5: preserve v4 behavior */,
      });
    },
  );

  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
  });
};

setupServer();
