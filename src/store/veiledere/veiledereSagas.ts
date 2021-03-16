import { call, put, select, takeEvery } from 'redux-saga/effects';
import { get } from '../../api';
import * as actions from './veiledere_actions';
import { VeiledereActionTypes } from './veiledere_actions';
import { Veileder } from './veiledereTypes';
import { ApplicationState } from '../index';

export function* hentVeiledereSaga() {
  const enhetId: string = yield select(
    (state: ApplicationState) => state.veilederenheter.aktivEnhetId
  );

  if (enhetId !== '') {
    yield put(actions.henterVeiledere(enhetId));
    try {
      const path = `${process.env.REACT_APP_SYFOVEILEDER_ROOT}/veiledere/enhet/${enhetId}`;
      const data: Veileder[] = yield call(get, path);
      yield put(actions.veiledereHentet(enhetId, data));
    } catch (e) {
      yield put(actions.hentVeiledereFeilet(enhetId));
    }
  }
}

export default function* veiledereSagas(): Generator {
  yield takeEvery(
    VeiledereActionTypes.HENT_VEILEDERE_FORESPURT,
    hentVeiledereSaga
  );
}
