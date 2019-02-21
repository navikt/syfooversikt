import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { get } from '../../api/index';
import * as actions from './veilederinfo_actions';
import { VeilederinfoActionTypes } from './veilederinfoTypes';
import { finnMiljoStreng } from '../../utils/miljoUtil';

export function* hentVeilederinfoSaga() {
  yield put(actions.henterVeilederinfo());
  try {
    const url = `https://app${finnMiljoStreng()}.adeo.no${process.env.REACT_APP_VEILEDEROPPGAVERREST_ROOT}/veilederinfo`;
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
  yield [fork(watchHentVeilederinfo)];
}