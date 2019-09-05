import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './enhetNavn_actions';
import { EnhetNavnActionTypes } from './enhetNavnTypes';
import { fullAppAdeoUrl } from '../../utils/miljoUtil';
import { hentVeilederEnhetFraState, skalHenteReducer } from '../../utils/selectorUtil';

export function* hentEnhetNavnSaga(enhetNummer: string) {
  yield put(actions.hentEnhetNavnHenter());
  try {
    const path = `${process.env.REACT_APP_NORG2REST_ROOT}/enhet/${enhetNummer}`;
    const url = fullAppAdeoUrl(path);
    const data = yield call(get, url);
    yield put(actions.hentEnhetNavnHentet(data));
  } catch (e) {
    yield put(actions.hentEnhetNavnFeilet());
  }
}

const hentetEnhet = (state: any) => {
  if(skalHenteReducer(state.enhetNavn)) {
    return hentVeilederEnhetFraState(state);
  }
};

export function* hentNavnHvisEnhetHentet(): any {
  const enhet = yield select(hentetEnhet);
  if (!!enhet) {
    yield hentEnhetNavnSaga(enhet.enhetId);
  }
}

function* watchHentEnhetNavn() {
  yield takeEvery(
    EnhetNavnActionTypes.HENT_ENHET_NAVN_FORESPURT,
    hentNavnHvisEnhetHentet
  );
}

export default function* enhetNavnSagas() {
  yield all([fork(watchHentEnhetNavn)]);
}
