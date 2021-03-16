import { call, put, takeEvery } from 'redux-saga/effects';
import { get, post } from '../../api';
import * as actions from './modiacontext_actions';
import {
  HentAktivEnhetAction,
  PushModiaContextAction,
} from './modiacontext_actions';
import { Modiacontext } from './modiacontextTypes';

export function* pushModiacontextSaga(action: PushModiaContextAction) {
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

export function* aktivEnhetSaga(action: HentAktivEnhetAction) {
  yield put(actions.henterAktivEnhet());
  try {
    const path = `${process.env.REACT_APP_MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`;
    const data: Modiacontext = yield call(get, path);
    action.data.callback(data.aktivEnhet);
  } catch (e) {
    yield put(actions.hentAktivEnhetFeilet());
  }
}

export default function* modiacontextSagas() {
  yield takeEvery(
    actions.modiacontextActionTypes.PUSH_MODIACONTEXT_FORESPURT,
    pushModiacontextSaga
  );
  yield takeEvery(
    actions.modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT,
    aktivEnhetSaga
  );
}
