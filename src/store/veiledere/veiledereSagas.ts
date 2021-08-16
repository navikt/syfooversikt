import { call, put, select, takeEvery } from 'redux-saga/effects';
import { get } from '@/api';
import * as actions from './veiledere_actions';
import { VeiledereActionTypes } from './veiledere_actions';
import { Veileder } from './veiledereTypes';
import { ApplicationState } from '@/store';
import { skalHenteReducer } from '@/utils/selectorUtil';
import { SYFOVEILEDER_ROOT } from '@/utils/apiUrlUtil';

export function* hentVeiledereSaga(enhetId: string) {
  yield put(actions.henterVeiledere(enhetId));
  try {
    const path = `${SYFOVEILEDER_ROOT}/v2/veiledere/enhet/${enhetId}`;
    const data: Veileder[] = yield call(get, path);
    yield put(actions.veiledereHentet(enhetId, data));
  } catch (e) {
    yield put(actions.hentVeiledereFeilet(enhetId));
  }
}

const hentetAktivEnhetId = (state: ApplicationState): string => {
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

export default function* veiledereSagas(): Generator {
  yield takeEvery(
    VeiledereActionTypes.HENT_VEILEDERE_FORESPURT,
    hentVeiledereHvisEnhetHentet
  );
}
