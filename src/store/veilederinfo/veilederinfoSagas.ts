import {
  all,
  call,
  fork,
  put,
  takeEvery,
} from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './veilederinfo_actions';
import { VeilederinfoActionTypes } from './veilederinfo_actions';
import { fullNaisUrl } from '../../utils/miljoUtil';
import { HOST_NAMES } from '../../konstanter';

export function* hentVeilederinfoSaga() {
  yield put(actions.henterVeilederinfo());
  try {
    const host = HOST_NAMES.SYFOMOTEADMIN;
    const path = `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo`;
    const url = fullNaisUrl(host,path);
    const data = yield call(get, url);
    yield put(actions.veilederinfoHentet(data));
  } catch (e) {
    yield put(actions.hentVeilederinfoFeilet());
  }
}

function* watchHentVeilederinfo() {
  yield takeEvery(
    VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT,
    hentVeilederinfoSaga
  );
}

export default function* veilederinfoSagas() {
  yield all([fork(watchHentVeilederinfo)]);
}
