import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import ModalWrapper from 'nav-frontend-modal';
import { CONTEXT_EVENT_TYPE } from './konstanter';
import {
  hentAktivEnhet,
  pushModiaContext,
} from './store/modiacontext/modiacontext_actions';
import { setAktivEnhetHentet } from './store/veilederenheter/veilederenheter_actions';
import './styles/styles.less';
import { fullNaisUrlDefault } from './utils/miljoUtil';
import AppRouter from './routers/AppRouter';
import { config, setEventHandlersOnConfig } from './global';
import { store } from './store';

const handleChangeEnhet = (data: string) => {
  if (config.config.initiellEnhet !== data) {
    store.dispatch(
      pushModiaContext({
        verdi: data,
        eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET,
      })
    );
    config.config.initiellEnhet = data;
  }
};

const handlePersonsokSubmit = (nyttFnr: string) => {
  const host = 'syfomodiaperson';
  const path = `/sykefravaer/${nyttFnr}`;
  window.location.href = fullNaisUrlDefault(host, path);
};

setEventHandlersOnConfig(handlePersonsokSubmit, handleChangeEnhet);

store.dispatch(
  hentAktivEnhet({
    callback: (aktivEnhet) => {
      store.dispatch(setAktivEnhetHentet(aktivEnhet));
      if (aktivEnhet && config.config.initiellEnhet !== aktivEnhet) {
        config.config.initiellEnhet = aktivEnhet;
        (window as any).renderDecoratorHead(config);
      }
    },
  })
);

(window as any).renderDecoratorHead &&
  (window as any).renderDecoratorHead(config);

render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('maincontent')
);

ModalWrapper.setAppElement('#maincontent');

document.addEventListener('DOMContentLoaded', () => {
  (window as any).renderDecoratorHead &&
    (window as any).renderDecoratorHead(config);
});
