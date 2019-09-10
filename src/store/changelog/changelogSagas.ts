import { fork, takeEvery, put, call } from 'redux-saga/effects';
import { ChangelogActionTypes,
    fetchChengelogsLoadingAction,
    fetchChangelogsSuccess,
    fetchChangelogError
} from './changelog_actions';
import { get } from '../../api';
import { Changelog } from './changelogTypes';

function* getChangelog(): IterableIterator<any> {
    try {
        put(fetchChengelogsLoadingAction());
        const changeLogPath = process.env.REACT_APP_CHANGELOG_ROOT as string;
        const data: Changelog[] = yield call(get, changeLogPath);
        yield put(fetchChangelogsSuccess(data));
    } catch (e) {
        yield put(fetchChangelogError(e));
    }
}

function* watchGetChangelog() {
    yield takeEvery(ChangelogActionTypes.FETCH_CHANGELOGS_ASKED, getChangelog);
}

export default function* changelogSagas() {
    yield [fork(watchGetChangelog)];
}
