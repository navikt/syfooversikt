import express from "express";

import { getOnBehalfOfToken } from "./authUtils.js";
import { auth, type ExternalAppConfig } from "./config.js";
import { logger } from "@navikt/pino-logger";

const TRANSIENT_ERROR_CODES = new Set([
  "ECONNRESET",
  "EPIPE",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ECONNREFUSED",
]);

const EXCLUDED_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailers",
  "proxy-authenticate",
  "proxy-authorization",
  "upgrade",
  "content-length",
  "content-encoding",
]);

function buildTargetUrl(
  host: string,
  req: express.Request,
  applicationName: string,
  removePathPrefix: boolean,
): string {
  const hostUrl = new URL(host);
  const basePath = hostUrl.pathname === "/" ? "" : hostUrl.pathname;
  const reqUrl = new URL(req.originalUrl, "http://localhost");
  let path = basePath + reqUrl.pathname + reqUrl.search;

  if (removePathPrefix) {
    const appPathPrefix = `/${applicationName}`;
    if (path.startsWith(`${appPathPrefix}/`)) {
      path = path.slice(appPathPrefix.length);
    }
  }

  return `${hostUrl.protocol}//${hostUrl.host}${path}`;
}

function buildForwardedHeaders(
  req: express.Request,
  accessToken?: string,
): Record<string, string> {
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (!EXCLUDED_HEADERS.has(key.toLowerCase()) && typeof value === "string") {
      headers[key] = value;
    }
  }

  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function getErrorCode(error: unknown): string | undefined {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "ABORT_ERR";
  }
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    if (cause instanceof Error) {
      return (cause as NodeJS.ErrnoException).code;
    }
  }
  return undefined;
}

function hasHeader(
  headers: Record<string, string>,
  headerName: string,
): boolean {
  const lowerCaseHeaderName = headerName.toLowerCase();
  return Object.keys(headers).some(
    (key) => key.toLowerCase() === lowerCaseHeaderName,
  );
}

async function sendProxyRequest(
  targetUrl: string,
  req: express.Request,
  res: express.Response,
  headers: Record<string, string>,
): Promise<void> {
  const hasBody =
    ["POST", "PUT", "PATCH"].includes(req.method) && req.body !== undefined;
  const forwardedHeaders =
    hasBody && !hasHeader(headers, "content-type")
      ? { ...headers, "content-type": "application/json" }
      : headers;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: forwardedHeaders,
    body: hasBody ? JSON.stringify(req.body) : undefined,
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (!EXCLUDED_HEADERS.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}

const proxyOnBehalfOf =
  (externalAppConfig: ExternalAppConfig): express.RequestHandler =>
  async (req, res, next) => {
    const {
      applicationName,
      host,
      clientId,
      removePathPrefix = false,
    } = externalAppConfig;
    let accessToken: string | undefined;

    try {
      accessToken = await getOnBehalfOfToken(req, clientId);
    } catch (error) {
      logger.error("Failed to get OBO token. Original error: %s", error);
      res.status(500).send("Failed to fetch access tokens on behalf of user");
      return;
    }

    if (!accessToken) {
      res.status(500).send("Failed to fetch access token on behalf of user.");
      logger.error("proxyOnBehalfOf: on-behalf-of-token was undefined");
      return;
    }

    const targetUrl = buildTargetUrl(
      host,
      req,
      applicationName,
      removePathPrefix,
    );
    try {
      await sendProxyRequest(
        targetUrl,
        req,
        res,
        buildForwardedHeaders(req, accessToken),
      );
    } catch (error) {
      const code = getErrorCode(error);
      logger.error(
        `Error in proxy for ${host} ${
          error instanceof Error ? error.message : error
        }, ${code}`,
      );
      if (code && TRANSIENT_ERROR_CODES.has(code)) {
        res.status(502).send({ message: `Could not contact ${host}` });
        return;
      }
      next(error);
    }
  };

const proxyWithoutAuthentication =
  (host: string): express.RequestHandler =>
  async (req, res, next) => {
    const targetUrl = buildTargetUrl(host, req, "", false);
    try {
      await sendProxyRequest(targetUrl, req, res, buildForwardedHeaders(req));
    } catch (error) {
      const code = getErrorCode(error);
      logger.error(
        `Error in proxy for ${host} ${
          error instanceof Error ? error.message : error
        }, ${code}`,
      );
      if (code && TRANSIENT_ERROR_CODES.has(code)) {
        res.status(502).send({ message: `Could not contact ${host}` });
        return;
      }
      next(error);
    }
  };

export const setupProxy = (): express.Router => {
  const router = express.Router();

  router.use("/ereg/*splat", proxyWithoutAuthentication(auth.ereg.host));
  router.use(
    "/modiacontextholder/*splat",
    proxyOnBehalfOf(auth.modiacontextholder),
  );
  router.use("/api/*splat", proxyOnBehalfOf(auth.syfooversiktsrv));
  router.use("/syfoperson/*splat", proxyOnBehalfOf(auth.syfoperson));
  router.use("/syfoveileder/*splat", proxyOnBehalfOf(auth.syfoveileder));
  router.use(
    "/syfobehandlendeenhet/*splat",
    proxyOnBehalfOf(auth.syfobehandlendeenhet),
  );

  return router;
};
