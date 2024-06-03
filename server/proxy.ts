import express from 'express';
import expressHttpProxy from 'express-http-proxy';
import url from 'url';
import OpenIdClient from 'openid-client';

import { getOrRefreshOnBehalfOfToken } from './authUtils';
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

const proxyDirectly = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  authClient: OpenIdClient.Client,
  externalAppConfig: Config.ExternalAppConfig
) => {
  return proxyExternalHostWithoutAuthentication(externalAppConfig.host)(
    req,
    res,
    next
  );
};

const proxyExternalHost = (
  externalAppConfig: Config.ExternalAppConfig,
  accessToken: any,
  parseReqBody: any
) =>
  expressHttpProxy(externalAppConfig.host, {
    https: false,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options, srcReq) => {
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
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<any>,
  externalAppConfig: Config.ExternalAppConfig
) => {
  getOrRefreshOnBehalfOfToken(
    authClient,
    issuer,
    req,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken) => {
      if (!onBehalfOfToken || !onBehalfOfToken.accessToken) {
        res.status(500).send('Failed to fetch access token on behalf of user.');
        console.log(
          'proxyOnBehalfOf: on-behalf-of-token or accessToken was undefined'
        );
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        onBehalfOfToken.accessToken,
        req.method === 'POST'
      )(req, res, next);
    })
    .catch((error: any) => {
      console.log('Failed to renew token(s). Original error: %s', error);
      res
        .status(500)
        .send('Failed to fetch/refresh access tokens on behalf of user');
    });
};

export const setupProxy = (
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<any>
) => {
  const router = express.Router();

  router.use(
    '/ereg/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyDirectly(req, res, next, authClient, Config.auth.ereg);
    }
  );

  router.use(
    '/modiacontextholder/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.modiacontextholder
      );
    }
  );

  router.use(
    '/api/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfooversiktsrv
      );
    }
  );

  router.use(
    '/syfoperson/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoperson
      );
    }
  );

  router.use(
    '/syfoveileder/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoveileder
      );
    }
  );

  router.use(
    '/internarbeidsflatedecorator',
    expressHttpProxy(Config.auth.internarbeidsflatedecoratorHost, {
      https: true,
      proxyReqPathResolver: (req) => {
        return `/internarbeidsflatedecorator${req.url}`;
      },
      proxyErrorHandler: (err, res, next) => {
        console.log(
          `Error in proxy for internarbeidsflatedecorator ${err.message}, ${err.code}`
        );
        if (err && err.code === 'ECONNREFUSED') {
          console.log('proxyErrorHandler: Got ECONNREFUSED');
          return res
            .status(503)
            .send({ message: `Could not contact internarbeidsflatedecorator` });
        }
        next(err);
      },
    })
  );

  router.use(
    '/flexjar-backend/*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, issuer, Config.auth.flexjar);
    }
  );

  return router;
};
