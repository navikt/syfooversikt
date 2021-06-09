import { call, put, takeEvery } from 'redux-saga/effects';
import { post } from '../../api';
import * as actions from './veilederArbeidstaker_actions';
import { PushVeilederArbeidstakerForespurtAction } from './veilederArbeidstaker_actions';

export function* pushBrukerArbeidstakerSaga(
  action: PushVeilederArbeidstakerForespurtAction
) {
  yield put(actions.pushVeilederArbeidstakerPusher());
  try {
    const body = { tilknytninger: action.data };
    const path = `${process.env.REACT_APP_SYFOOVERSIKTSRVREST_ROOT}/post/v1/persontildeling/registrer`;
    yield call(post, path, body);
    yield put(actions.pushVeilederArbeidstakerPushet(action.data));
  } catch (e) {
    yield put(actions.pushVeilederArbeidstakerFeilet());
  }
}

export default function* veilederArbeidstakerSagas() {
  yield takeEvery(
    actions.veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FORESPURT,
    pushBrukerArbeidstakerSaga
  );
}
