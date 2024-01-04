import unleashClient = require('unleash-client');
import { Strategy } from 'unleash-client';
import Config = require('./config');
import { Context } from 'unleash-client/lib/context';

const { initialize } = unleashClient;

class VeilederIds extends Strategy {
  constructor() {
    super('VeilederIds');
  }

  isEnabled(parameters: any, context: Context) {
    return parameters.veilederId.indexOf(context.veilederId) !== -1;
  }
}

class EnhetIds extends Strategy {
  constructor() {
    super('EnhetIds');
  }

  isEnabled(parameters: any, context: Context) {
    return parameters.enhetId.indexOf(context.enhetId) !== -1;
  }
}

export const unleash = initialize({
  url: Config.unleash.serverApiUrl + '/api',
  appName: 'syfooversikt',
  customHeaders: { Authorization: Config.unleash.serverApiToken },
  strategies: [new VeilederIds(), new EnhetIds()],
});

export const getToggles = (veilederId: any, enhetId: any) => {
  const context = {
    veilederId: veilederId,
    enhetId: enhetId,
  };
  return {
    isHuskelappEnabled: unleash.isEnabled('isHuskelappEnabled', context),
    isFlexjarEnabled: unleash.isEnabled('isFlexjarEnabled', context),
  };
};
