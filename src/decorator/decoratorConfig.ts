import { isAnsattDev, isDev, isLocal, isProd } from '@/utils/miljoUtil';
import { DecoratorProps, Environment, UrlFormat } from '@/decorator/types.ts';

const getEnvironment = (): Environment => {
  if (isProd()) {
    return 'prod';
  } else if (isDev()) {
    return 'q2';
  } else {
    return 'mock';
  }
};

const getUrlFormat = (): UrlFormat => {
  if (isAnsattDev()) {
    return 'ANSATT';
  } else if (isLocal()) {
    return 'LOCAL';
  } else return 'NAV_NO';
};

export const decoratorConfig: DecoratorProps = {
  appName: 'Sykefraværsoppfølging',
  fetchActiveEnhetOnMount: true,
  showEnheter: true,
  showSearchArea: true,
  showHotkeys: false,
  environment: getEnvironment(),
  urlFormat: getUrlFormat(),
  proxy: '/modiacontextholder',
  fnrSyncMode: 'writeOnly',
};
