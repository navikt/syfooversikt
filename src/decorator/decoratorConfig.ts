import { DecoratorPropsV3, Enhet } from './decoratorProps';
import { erLokal, isProd } from '@/utils/miljoUtil';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';

export function lagConfigV3(
  settEnhet: (enhet: string, enhetValue?: Enhet) => void,
  setFnr: (fnr: string) => void,
  aktivEnhet?: string
): DecoratorPropsV3 {
  const enhet = erLokal() ? aktivEnhetMock.aktivEnhet : aktivEnhet;
  // const { sokFnr, pathFnr, userKey } = getFnrFraUrl();
  // const onsketFnr = sokFnr || pathFnr;
  const getEnvFromHost = () => {
    switch (window.location.host) {
      case 'app.adeo.no':
      case 'syfooversikt.intern.nav.no':
        return 'prod';
      case 'app-q1.adeo.no':
        return 'q1';
      case 'app-q0.adeo.no':
        return 'q0';
      case 'syfooversikt.intern.dev.nav.no':
        return 'q2';
    }
    return 'mock';
  };

  const environment = isProd() ? getEnvFromHost() : 'mock';

  return {
    appName: 'Syfooversikt',
    onFnrChanged: (fnr) => {
      if (fnr) {
        setFnr(fnr);
      }
    },
    enhet: enhet,
    onEnhetChanged: (enhet, enhetValue) => {
      if (enhet) {
        settEnhet(enhet, enhetValue);
      }
    },
    showHotkeys: false,
    environment,
    urlFormat: isProd()
      ? window.location.host.includes('adeo.no')
        ? 'ADEO'
        : 'NAV_NO'
      : 'LOCAL',
    showEnheter: true,
    showSearchArea: true,
    fetchActiveUserOnMount: true,
    fetchActiveEnhetOnMount: true,
  };
}
