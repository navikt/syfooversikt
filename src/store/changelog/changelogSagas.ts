import { call, put, takeEvery } from 'redux-saga/effects';
import {
  ChangelogActionTypes,
  fetchChangelogError,
  fetchChangelogsSuccess,
  fetchChengelogsLoadingAction,
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
    yield put(fetchChangelogError());
  }
}

export default function* changelogSagas() {
  yield takeEvery(ChangelogActionTypes.FETCH_CHANGELOGS_ASKED, getChangelog);
}
