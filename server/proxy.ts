import express from 'express';
import expressHttpProxy from 'express-http-proxy';
import url from 'url';

import { getOnBehalfOfToken } from './authUtils';
import * as Config from './config';

const proxyExternalHostWithoutAuthentication = (host: any) =>
  expressHttpProxy(host, {
    https: false,
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(host);
      const pathFromApi =
        urlFromApi.pathname === '/' ? '' : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : '') +
        (pathFromRequest ? pathFromRequest : '') +
        (queryString ? '?' + queryString : '');

      return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(`Error in proxy for ${host} ${err.message}, ${err.code}`);
      if (err && err.code === 'ECONNREFUSED') {
        console.log('proxyErrorHandler: Got ECONNREFUSED');
        return res.status(503).send({ message: `Could not contact ${host}` });
      }
      next(err);
    },
  });

const proxyExternalHost = (
  externalAppConfig: Config.ExternalAppConfig,
  accessToken: any,
  parseReqBody: any
) =>
  expressHttpProxy(externalAppConfig.host, {
    https: false,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options) => {
      if (!accessToken) {
        return options;
      }
      if (!options.headers) {
        options.headers = {};
      }
      options.headers['Authorization'] = `Bearer ${accessToken}`;
      return options;
    },
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(externalAppConfig.host);
      const pathFromApi =
        urlFromApi.pathname === '/' ? '' : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : '') +
        (pathFromRequest ? pathFromRequest : '') +
        (queryString ? '?' + queryString : '');

      if (externalAppConfig.removePathPrefix) {
        const newPathWithoutPrefix = newPath.replace(
          `${externalAppConfig.applicationName}/`,
          ''
        );
        return newPathWithoutPrefix;
      }

      return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(
        `Error in proxy for ${externalAppConfig.host} ${err.message}, ${err.code}`
      );
      if (err && err.code === 'ECONNREFUSED') {
        console.log('proxyErrorHandler: Got ECONNREFUSED');
        return res
          .status(503)
          .send({ message: `Could not contact ${externalAppConfig.host}` });
      }
      next(err);
    },
  });

const proxyOnBehalfOf = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  externalAppConfig: Config.ExternalAppConfig
) => {
  getOnBehalfOfToken(req, `api://${externalAppConfig.clientId}/.default`)
    .then((accessToken) => {
      if (!accessToken) {
        res.status(500).send('Failed to fetch access token on behalf of user.');
        console.log('proxyOnBehalfOf: on-behalf-of-token was undefined');
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        accessToken,
        req.method === 'POST'
      )(req, res, next);
    })
    .catch((error: any) => {
      console.log('Failed to get OBO token. Original error: %s', error);
      res.status(500).send('Failed to fetch access tokens on behalf of user');
    });
};

export const setupProxy = () => {
  const router = express.Router();

  router.use(
    '/ereg/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyExternalHostWithoutAuthentication(Config.auth.ereg.host)(
        req,
        res,
        next
      );
    }
  );

  router.use(
    '/modiacontextholder/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.modiacontextholder);
    }
  );

  router.use(
    '/api/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfooversiktsrv);
    }
  );

  router.use(
    '/syfoperson/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfoperson);
    }
  );

  router.use(
    '/syfoveileder/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfoveileder);
    }
  );

  router.use(
    '/syfobehandlendeenhet/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfobehandlendeenhet);
    }
  );

  router.use(
    '/flexjar-backend/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.flexjar);
    }
  );

  return router;
};
