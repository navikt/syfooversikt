import {
  DecoratorProps,
  Enhet,
  Environment,
  UrlFormat,
} from './decoratorProps';
import { isAnsattDev, isDev, isLocal, isProd } from '@/utils/miljoUtil';

const decoratorConfig = (
  setFnr: (fnr: string) => void,
  setEnhet: (enhet: string) => void
): DecoratorProps => {
  return {
    appName: 'Sykefraværsoppfølging',
    fetchActiveEnhetOnMount: true,
    onEnhetChanged: (enhetId?: string | null, enhet?: Enhet) => {
      setEnhet(enhetId || enhet?.enhetId || '');
    },
    onFnrChanged: (fnr?: string | null) => {
      if (fnr) {
        setFnr(fnr);
      }
    },
    fnrSyncMode: 'writeOnly',
    showEnheter: true,
    showSearchArea: true,
    showHotkeys: false,
    environment: getEnvironment(),
    urlFormat: getUrlFormat(),
    proxy: '/modiacontextholder',
  };
};

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

export default decoratorConfig;
