import { call, put, takeEvery } from 'redux-saga/effects';
import {
  ChangelogActionTypes,
  fetchChangelogError,
  fetchChangelogsSuccess,
  fetchChengelogsLoadingAction,
} from './changelog_actions';
import { get } from '../../api';
import { CHANGELOG_ROOT } from '../../utils/apiUrlUtil';

function* getChangelog(): IterableIterator<any> {
  try {
    put(fetchChengelogsLoadingAction());
    const data = yield call(get, CHANGELOG_ROOT);
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
