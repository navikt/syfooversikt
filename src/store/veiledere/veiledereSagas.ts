import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './veiledere_actions';
import { VeiledereActionTypes } from './veiledere_actions';
import { fullNaisUrlDefault } from '../../utils/miljoUtil';
import { HOST_NAMES } from '../../konstanter';
import { skalHenteReducer } from '../../utils/selectorUtil';

export function* hentVeiledereSaga(
  enhetId: string,
) {
  yield put(actions.henterVeiledere());
  try {
    const host = HOST_NAMES.SYFOVEILEDER;
    const path = `${process.env.REACT_APP_SYFOVEILEDER_ROOT}/veiledere/enhet/${enhetId}`;
    const url = fullNaisUrlDefault(host,path);
    const data = yield call(get, url);
    yield put(actions.veiledereHentet(data));
  } catch (e) {
    yield put(actions.hentVeiledereFeilet());
  }
}

const hentetAktivEnhetId = (state: any): string => {
  return skalHenteReducer(state.veiledere)
    ? state.veilederenheter.aktivEnhet.enhetId
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
