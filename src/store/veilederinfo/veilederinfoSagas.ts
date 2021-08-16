import { call, put, takeEvery } from 'redux-saga/effects';
import { get } from '@/api';
import * as actions from './veilederinfo_actions';
import { VeilederinfoActionTypes } from './veilederinfo_actions';
import { VeilederinfoDTO } from './veilederinfoTypes';
import { SYFOVEILEDER_ROOT } from '@/utils/apiUrlUtil';

export function* hentVeilederinfoSaga() {
  yield put(actions.henterVeilederinfo());
  try {
    const path = `${SYFOVEILEDER_ROOT}/v2/veileder/self`;
    const data: VeilederinfoDTO = yield call(get, path);
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
