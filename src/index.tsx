import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import ModalWrapper from 'nav-frontend-modal';
import './styles/styles.less';
import AppRouter from './routers/AppRouter';
import { store } from './store';

render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('maincontent')
);

ModalWrapper.setAppElement('#maincontent');
