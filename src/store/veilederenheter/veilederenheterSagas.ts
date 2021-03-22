import { call, put, takeEvery } from 'redux-saga/effects';
import { get } from '../../api';
import * as actions from './veilederenheter_actions';
import { Veilederenheter } from './veilederenheterTypes';

export function* hentVeilederenheter() {
  yield put(actions.hentVeilederenheterHenter());
  try {
    const path = `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo/enheter`;
    const data: Veilederenheter = yield call(get, path);
    yield put(actions.hentVeilederenheterHentet(data));
  } catch (e) {
    yield put(actions.hentVeilederenheterFeilet());
  }
}

export default function* veilederinfoSagas() {
  yield takeEvery(
    actions.VeilederenheterActionTypes.HENT_VEILEDERENHETER_FORESPURT,
    hentVeilederenheter
  );
}
