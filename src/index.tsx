import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import {
  CONTEXT_EVENT_TYPE,
  HOST_NAMES,
} from './konstanter';
import {
  hentAktivEnhet,
  pushModiaContext,
} from './store/modiacontext/modiacontext_actions';
import './styles/styles.less';
import {
  finnMiljoStreng,
  fullNaisUrl,
} from './utils/miljoUtil';
import AppRouter from './routers/AppRouter';

import { store, history } from './store';
import { hentEnhetNavnForespurt } from './store/enhetNavn/enhetNavn_actions';

if (!(window as any)._babelPolyfill) {
  require('babel-polyfill'); // tslint:disable-line no-var-requires
}

const config = {
  config: {
    dataSources: {
      veileder: `${fullNaisUrl(HOST_NAMES.SYFOMOTEADMIN, `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo`)}`,
      enheter: `${fullNaisUrl(HOST_NAMES.SYFOMOTEADMIN, `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo/enheter`)}`,
    },
    initiellEnhet: '',
    toggles: {
      visEnhetVelger: true,
      visVeileder: true,
      visSokefelt: true,
      toggleSendEventVedEnEnhet: false,
    },
    handlePersonsokSubmit: (nyttFnr: string) => {
      (window as any).location = `https://app${finnMiljoStreng()}.adeo.no/sykefravaer/${nyttFnr}`;
    },
    applicationName: 'Oppfølging',
    handleChangeEnhet: (data: string) => {
      if (config.config.initiellEnhet !== data) {
        store.dispatch(
          pushModiaContext({
            verdi: data,
            eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET,
          })
        );
        config.config.initiellEnhet = data;
      }
    },
  },
};

store.dispatch(hentEnhetNavnForespurt({ id: '0315'}));

store.dispatch(
  hentAktivEnhet({
    callback: (aktivEnhet) => {
      if (aktivEnhet && config.config.initiellEnhet !== aktivEnhet) {
        config.config.initiellEnhet = aktivEnhet;
        (window as any).renderDecoratorHead(config);
      }
    },
  })
);

(window as any).renderDecoratorHead && (window as any).renderDecoratorHead(config); // tslint:disable-line no-unused-expression

render(
  <Provider store={store}>
    <AppRouter history={history} />
  </Provider>,
  document.getElementById('maincontent')
);

/* tslint:disable no-unused-expression */
document.addEventListener('DOMContentLoaded', () => {
  (window as any).renderDecoratorHead &&
    (window as any).renderDecoratorHead(config);
});
/* tslint:enable no-unused-expression */
