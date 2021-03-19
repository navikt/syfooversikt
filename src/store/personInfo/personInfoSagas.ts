import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { post } from '../../api/index';
import * as actions from './personInfo_actions';

export function* hentPersonInfoSaga(
  action: ReturnType<typeof actions.hentPersonInfoForespurt>
) {
  yield put(actions.hentPersonInfoHenter());
  try {
    const path = `${process.env.REACT_APP_SYFOPERSONREST_ROOT}/person/info`;
    const data = yield call(post, path, action.data);
    yield put(actions.hentPersonInfoHentet(data));
  } catch (e) {
    yield put(actions.hentPersonInfoFeilet());
  }
}

function* watchHentPersonInfo() {
  yield takeEvery(
    actions.PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
    hentPersonInfoSaga
  );
}

export default function* personInfoSagas() {
  yield all([fork(watchHentPersonInfo)]);
}
