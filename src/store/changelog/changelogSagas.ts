import { fork, takeEvery, put, call, all } from 'redux-saga/effects';
import {
  ChangelogActionTypes,
  fetchChengelogsLoadingAction,
  fetchChangelogsSuccess,
  fetchChangelogError,
} from './changelog_actions';
import { get } from '../../api';

function* getChangelog(): IterableIterator<any> {
  try {
    put(fetchChengelogsLoadingAction());
    const changeLogPath = process.env.REACT_APP_CHANGELOG_ROOT as string;
    const data = yield call(get, changeLogPath);
    if (data) {
      yield put(fetchChangelogsSuccess(data));
    }
  } catch (e) {
    yield put(fetchChangelogError(e));
  }
}

function* watchGetChangelog() {
  yield takeEvery(ChangelogActionTypes.FETCH_CHANGELOGS_ASKED, getChangelog);
}

export default function* changelogSagas() {
  yield all([fork(watchGetChangelog)]);
}
