import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './veiledere_actions';
import { VeiledereActionTypes } from './veiledere_actions';
import { skalHenteReducer } from '../../utils/selectorUtil';

export function* hentVeiledereSaga(enhetId: string) {
  yield put(actions.henterVeiledere(enhetId));
  try {
    const path = `${process.env.REACT_APP_SYFOVEILEDER_ROOT}/veiledere/enhet/${enhetId}`;
    const data = yield call(get, path);
    yield put(actions.veiledereHentet(enhetId, data));
  } catch (e) {
    yield put(actions.hentVeiledereFeilet(enhetId));
  }
}

const hentetAktivEnhetId = (state: any): string => {
  return skalHenteReducer(
    state.veiledere[state.veilederenheter.aktivEnhetId] || {}
  )
    ? state.veilederenheter.aktivEnhetId
    : '';
};

export function* hentVeiledereHvisEnhetHentet(): any {
  const enhetId = yield select(hentetAktivEnhetId);
  if (enhetId !== '') {
    yield hentVeiledereSaga(enhetId);
  }
}

function* watchHentVeiledere() {
  yield takeEvery(
    VeiledereActionTypes.HENT_VEILEDERE_FORESPURT,
    hentVeiledereHvisEnhetHentet
  );
}

export default function* veiledereSagas() {
  yield all([fork(watchHentVeiledere)]);
}
