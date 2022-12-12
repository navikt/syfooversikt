import * as unleashClient from 'unleash-client';

class ByDevEnhet extends unleashClient.Strategy {
  constructor() {
    super('byDevEnhet');
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === 'dev';
  }
}

class ByProdEnhet extends unleashClient.Strategy {
  constructor() {
    super('byProdEnhet');
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === 'prod';
  }
}

class ByEnvironment extends unleashClient.Strategy {
  constructor() {
    super('byEnvironment');
  }

  isEnabled(parameters: any, context: any) {
    return parameters.miljø.includes(process.env.NAIS_CONTEXT);
  }
}

class ByEnvironmentToggle extends unleashClient.Strategy {
  constructor() {
    super('byEnvironmentToggle');
  }

  isEnabled(parameters: any) {
    return (
      (parameters.dev === 'true' && process.env.NAIS_CONTEXT === 'dev') ||
      (parameters.prod === 'true' && process.env.NAIS_CONTEXT === 'prod')
    );
  }
}

class ByUserId extends unleashClient.Strategy {
  constructor() {
    super('byUserId');
  }

  isEnabled(parameters: any, context: any) {
    if (!context.user) {
      return false;
    }

    return parameters.user.indexOf(context.user) !== -1;
  }
}

const unleash = unleashClient.initialize({
  url: 'https://unleash.nais.io/api/',
  appName: 'syfooversikt',
  environment: process.env.NAIS_CONTEXT,
  strategies: [
    new ByDevEnhet(),
    new ByProdEnhet(),
    new ByUserId(),
    new ByEnvironment(),
    new ByEnvironmentToggle(),
  ],
});

export const getUnleashToggles = (
  toggles: any,
  valgtEnhet: any,
  userId: any
) => {
  return toggles.reduce((acc: any, toggle: any) => {
    acc[toggle] = unleash.isEnabled(toggle, {
      valgtEnhet: valgtEnhet,
      user: userId,
    });
    return acc;
  }, {});
};
