import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { get, post } from '../../api/index';
import * as actions from './modiacontext_actions';

export function* pushModiacontextSaga(
  action: ReturnType<typeof actions.pushModiaContext>
) {
  yield put(actions.pusherModiaContext());
  try {
    const path = `${process.env.REACT_APP_MODIACONTEXTHOLDER_ROOT}/context`;
    yield call(post, path, {
      verdi: action.data.verdi,
      eventType: action.data.eventType,
    });
    yield put(actions.modiaContextPushet(action.data));
  } catch (e) {
    yield put(actions.pushModiaContextFeilet());
  }
}

export function* aktivEnhetSaga(
  action: ReturnType<typeof actions.hentAktivEnhet>
) {
  yield put(actions.henterAktivEnhet());
  try {
    const path = `${process.env.REACT_APP_MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`;
    const data = yield call(get, path);
    action.data.callback(data.aktivEnhet);
  } catch (e) {
    yield put(actions.hentAktivEnhetFeilet());
  }
}

function* watchPushModiacontext() {
  yield takeEvery(
    actions.modiacontextActionTypes.PUSH_MODIACONTEXT_FORESPURT,
    pushModiacontextSaga
  );
}

function* watchAktivEnhet() {
  yield takeEvery(
    actions.modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT,
    aktivEnhetSaga
  );
}

export default function* modiacontextSagas() {
  yield all([fork(watchPushModiacontext), fork(watchAktivEnhet)]);
}
