import {
  all,
  call,
  fork,
  put,
  takeEvery,
} from 'redux-saga/effects';
import { post } from '../../api/index';
import * as actions from './personInfo_actions';
import { fullNaisUrlDefault } from '../../utils/miljoUtil';
import { HOST_NAMES } from '../../konstanter';

export function* hentPersonInfoSaga(action: ReturnType<typeof actions.hentPersonInfoForespurt>) {
  yield put(actions.hentPersonInfoHenter());
  try {
    const host = HOST_NAMES.SYFOPERSON;
    const path = `${process.env.REACT_APP_SYFOPERSONREST_ROOT}/person/info`;
    const url = fullNaisUrlDefault(host, path);
    const data = yield call(post, url, action.data);
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
