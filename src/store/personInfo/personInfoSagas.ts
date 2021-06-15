import { call, put, takeEvery } from 'redux-saga/effects';
import { post } from '../../api';
import * as actions from './personInfo_actions';
import { HentPersonInfoForespurtAction } from './personInfo_actions';
import { PersonInfo } from './personInfoTypes';
import { SYFOPERSONREST_ROOT } from '../../utils/apiUrlUtil';

export function* hentPersonInfoSaga(action: HentPersonInfoForespurtAction) {
  yield put(actions.hentPersonInfoHenter());
  try {
    const path = `${SYFOPERSONREST_ROOT}/v2/person/info`;
    const data: PersonInfo[] = yield call(post, path, action.data);
    yield put(actions.hentPersonInfoHentet(data));
  } catch (e) {
    yield put(actions.hentPersonInfoFeilet());
  }
}

export default function* personInfoSagas() {
  yield takeEvery(
    actions.PersonInfoActionTypes.HENT_PERSON_INFO_FORESPURT,
    hentPersonInfoSaga
  );
}
