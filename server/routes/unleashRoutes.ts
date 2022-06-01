import * as unleashClient from 'unleash-client';

class ByEnhetAndEnvironment extends unleashClient.Strategy {
  constructor() {
    super('byEnhetAndEnvironment');
  }

  isEnabled(parameters: any, context: any) {
    if (process.env.NAIS_CONTEXT === 'dev') {
      return true;
    }
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.valgtEnhet.indexOf(context.valgtEnhet) !== -1;
    const environmentEnabled = parameters.tilgjengeligIProd === 'true';

    return valgtEnhetMatches && environmentEnabled;
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
  strategies: [new ByEnhetAndEnvironment(), new ByUserId()],
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
