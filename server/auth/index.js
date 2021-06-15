const OpenIdClient = require('openid-client');
const passport = require('passport');

const session = require('../session.js');
const AuthUtils = require('./utils.js');
const Config = require('../config.js');

const dotenv = require('dotenv');
dotenv.config();

const ensureAuthenticated = () => {
  return async (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Unauthorized');
  };
};

const getStrategy = async (authClient) => {
  return new OpenIdClient.Strategy(
    {
      client: authClient,
      params: {
        response_type: Config.auth.responseType,
        response_mode: Config.auth.responseMode,
        scope: `openid offline_access ${Config.auth.clientId}/.default`,
      },
      usePKCE: 'S256',
      passReqToCallback: true,
    },
    (req, tokenSet, done) => {
      if (!tokenSet.expired()) {
        console.log('OpenIdClient.Strategy: Mapping tokenSet to User.');
        return done(null, {
          tokenSets: {
            [Config.tokenSetIdType.self]: tokenSet,
          },
        });
      }
      // Passport kaller bare denne funksjonen for å mappe en ny innlogging til et User-objekt, så man skal ikke havne her.
      console.log(
        'OpenIdClient.Strategy: Failed to map tokenSet to User because the tokenSet has already expired.'
      );
      done(null, undefined);
    }
  );
};

const setupPassport = async (app, authClient) => {
  app.use(passport.initialize());
  app.use(passport.session());

  const authName = Config.isDev ? 'localAuth' : 'aad';
  const authStrategy = await getStrategy(authClient);

  passport.use(authName, authStrategy);
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get(
    '/login',
    (req, _res, next) => {
      if (typeof req.query.redirectTo === 'string') {
        req.session.redirectTo = req.query.redirectTo;
      }
      next();
    },
    passport.authenticate(authName, { failureRedirect: '/login-failed' })
  );
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  app.get(
    '/oauth2/callback',
    passport.authenticate(authName, { failureRedirect: '/login-failed' }),
    (req, res) => {
      res.redirect(req.session.redirectTo || '/fastlege');
    }
  );
  app.get('/login-failed', (_req, res) => {
    res.send('login failed');
  });
};

const setupAuth = async (app) => {
  session.setupSession(app);

  const authClient = await AuthUtils.getOpenIdClient(Config.auth.discoverUrl);

  await setupPassport(app, authClient);

  return authClient;
};

module.exports = {
  setupAuth: setupAuth,
  ensureAuthenticated: ensureAuthenticated,
};
