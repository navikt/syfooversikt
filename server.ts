import express from "express";
import helmet from "helmet";
import path from "path";

import { validateToken } from "./server/authUtils.js";
import { setupProxy } from "./server/proxy.js";
import { getUnleashToggles } from "./server/unleash.js";
import { fileURLToPath } from "url";
import { logger } from "@navikt/pino-logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.use(express.json() as any);
server.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'", "https://*.nav.no"],
        "script-src": ["'self'", "'unsafe-inline'", "https://*.nav.no"],
        "style-src": ["'self'", "'unsafe-inline'", "https://*.nav.no"],
        "font-src": ["'self'", "data:", "https://*.nav.no"],
        "connect-src": ["'self'", "https://*.nav.no", "wss://*.nav.no"],
      },
    },
  }),
);

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
