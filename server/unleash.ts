import { initialize, Strategy, Context } from 'unleash-client';
import { unleashConfig } from './config.js';

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
  url: unleashConfig.serverApiUrl + '/api',
  appName: 'syfooversikt',
  customHeaders: { Authorization: unleashConfig.serverApiToken },
  strategies: [new VeilederIds(), new EnhetIds()],
});

export function getUnleashToggles(veilederId: any, enhetId: any) {
  const context = {
    veilederId: veilederId,
    enhetId: enhetId,
  };
  return {
    isRutingFlexjarEnabled: unleash.isEnabled(
      'isRutingFlexjarEnabled',
      context
    ),
    isTildelOppfolgingsenhetEnabled: unleash.isEnabled(
      'isTildelOppfolgingsenhetEnabled',
      context
    ),
    isKartleggingssporsmalEnabled: unleash.isEnabled(
      'isKartleggingssporsmalEnabled',
      context
    ),
  };
}
