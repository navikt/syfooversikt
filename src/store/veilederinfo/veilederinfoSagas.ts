import { call, put, takeEvery } from 'redux-saga/effects';
import { get } from '../../api';
import * as actions from './veilederinfo_actions';
import { VeilederinfoActionTypes } from './veilederinfo_actions';
import { Veilederinfo } from './veilederinfoTypes';

export function* hentVeilederinfoSaga() {
  yield put(actions.henterVeilederinfo());
  try {
    const path = `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo`;
    const data: Veilederinfo = yield call(get, path);
    yield put(actions.veilederinfoHentet(data));
  } catch (e) {
    yield put(actions.hentVeilederinfoFeilet());
  }
}

export default function* veilederinfoSagas(): Generator {
  yield takeEvery(
    VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT,
    hentVeilederinfoSaga
  );
}
